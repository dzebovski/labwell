"use server";

import { buildEnquiryEmail, parseSubmission, sendEnquiry, type SendResult } from "@/lib/contact-form";
import { SITE_URL } from "@/lib/site-config";

export type ContactActionResult = { status: SendResult | "invalid"; fields?: string[] };

/**
 * Contact form submission. Public by design (anyone may send an enquiry), so it only
 * validates input and filters spam; spam gets "sent" so bots learn nothing.
 */
export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  const parsed = parseSubmission(formData);
  if (parsed.kind === "spam") return { status: "sent" };
  if (parsed.kind === "invalid") return { status: "invalid", fields: parsed.fields };

  const status = await sendEnquiry(buildEnquiryEmail(parsed.enquiry, SITE_URL), {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FORM_TO: process.env.CONTACT_FORM_TO,
    CONTACT_FORM_FROM: process.env.CONTACT_FORM_FROM,
  });
  if (status !== "sent") console.error(`contact form: ${status}`);
  return { status };
}
