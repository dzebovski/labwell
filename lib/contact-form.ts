/**
 * Contact form on the server: validation, spam checks, the e-mail text and delivery through
 * Resend's HTTP API. Pure apart from `sendEnquiry`, which takes `fetch` and the environment
 * as arguments so tests never reach the network.
 *
 * Environment (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     — set by the Resend integration from the Vercel Marketplace;
 *   CONTACT_FORM_TO    — where enquiries go (comma-separated for several addresses);
 *   CONTACT_FORM_FROM  — sender; until LabWell's domain is verified in Resend it stays
 *                        "LabWell <onboarding@resend.dev>", which only delivers to the Resend
 *                        account owner's address.
 */
import { z } from "zod";

/** Name of the hidden field bots fill in and people never see. */
export const HONEYPOT_FIELD = "website";
/** Hidden field with the time (ms since epoch) the form was rendered. */
export const STARTED_AT_FIELD = "startedAt";
/** A person needs at least this long to fill in a name and a phone number. */
export const MIN_FILL_MS = 2500;

const phonePattern = /^\+?[\d\s()\-.]{7,20}$/;

const enquirySchema = z.strictObject({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(phonePattern)
    .refine((value) => value.replace(/\D/g, "").length >= 7),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]),
  message: z.string().trim().max(4000),
  page: z.string().trim().max(300).regex(/^\/[\w\-/.%]*$/),
  locale: z.enum(["uk", "en"]),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export type ParsedSubmission =
  | { kind: "valid"; enquiry: Enquiry }
  | { kind: "invalid"; fields: string[] }
  | { kind: "spam"; reason: "honeypot" | "too-fast" };

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

/** Reads the submitted form. Spam is reported separately so the caller can answer "sent" without sending. */
export function parseSubmission(data: FormData, now = Date.now()): ParsedSubmission {
  if (field(data, HONEYPOT_FIELD).trim()) return { kind: "spam", reason: "honeypot" };

  const startedAt = Number(field(data, STARTED_AT_FIELD) || Number.NaN);
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_FILL_MS) return { kind: "spam", reason: "too-fast" };

  const result = enquirySchema.safeParse({
    name: field(data, "name"),
    phone: field(data, "phone"),
    email: field(data, "email"),
    message: field(data, "message"),
    page: field(data, "page") || "/",
    locale: field(data, "locale"),
  });
  if (!result.success) {
    return { kind: "invalid", fields: [...new Set(result.error.issues.map((issue) => String(issue.path[0])))] };
  }
  return { kind: "valid", enquiry: result.data };
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** The e-mail LabWell receives. Always in Ukrainian: it is read by the team, not the visitor. */
export function buildEnquiryEmail(enquiry: Enquiry, siteUrl: string) {
  const pageUrl = `${siteUrl.replace(/\/$/, "")}${enquiry.page}`;
  const rows: Array<[string, string]> = [
    ["Ім’я", enquiry.name],
    ["Телефон", enquiry.phone],
    ["Email", enquiry.email || "—"],
    ["Повідомлення", enquiry.message || "—"],
    ["Сторінка", pageUrl],
    ["Мова сайту", enquiry.locale],
  ];

  return {
    subject: `Заявка з сайту LabWell — ${enquiry.name}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: [
      `<h2 style="font-family:sans-serif">Заявка з сайту LabWell</h2>`,
      `<table style="font-family:sans-serif;border-collapse:collapse">`,
      ...rows.map(
        ([label, value]) =>
          `<tr><td style="padding:4px 12px 4px 0;color:#41576b;vertical-align:top">${label}</td>` +
          `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
      ),
      `</table>`,
    ].join(""),
    replyTo: enquiry.email || undefined,
  };
}

export type SendResult = "sent" | "unconfigured" | "failed";

type Env = Partial<Record<"RESEND_API_KEY" | "CONTACT_FORM_TO" | "CONTACT_FORM_FROM", string>>;

/** Sends the enquiry through Resend. "unconfigured" when the key or the recipient is missing. */
export async function sendEnquiry(
  email: ReturnType<typeof buildEnquiryEmail>,
  env: Env,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_FORM_TO?.split(",").map((address) => address.trim()).filter(Boolean) ?? [];
  if (!apiKey || to.length === 0) return "unconfigured";

  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FORM_FROM?.trim() || "LabWell <onboarding@resend.dev>",
        to,
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
