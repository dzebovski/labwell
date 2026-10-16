import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEnquiryEmail,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  parseSubmission,
  sendEnquiry,
  STARTED_AT_FIELD,
} from "./contact-form.ts";

const now = 1_800_000_000_000;

function form(values: Record<string, string> = {}) {
  const data = new FormData();
  const all = {
    name: "Олена",
    phone: "+38 (067) 123-45-67",
    email: "",
    message: "Цікавить MAGLUMI X8.",
    page: "/uk/products/maglumi-x8",
    locale: "uk",
    [STARTED_AT_FIELD]: String(now - MIN_FILL_MS - 1),
    ...values,
  };
  for (const [key, value] of Object.entries(all)) data.set(key, value);
  return data;
}

test("a filled form is valid and trimmed", () => {
  const result = parseSubmission(form({ name: "  Олена  " }), now);
  assert.equal(result.kind, "valid");
  assert.equal(result.kind === "valid" && result.enquiry.name, "Олена");
});

test("the honeypot and a too-fast submission are spam", () => {
  assert.deepEqual(parseSubmission(form({ [HONEYPOT_FIELD]: "http://spam" }), now), { kind: "spam", reason: "honeypot" });
  assert.deepEqual(parseSubmission(form({ [STARTED_AT_FIELD]: String(now - 500) }), now), { kind: "spam", reason: "too-fast" });
  assert.deepEqual(parseSubmission(form({ [STARTED_AT_FIELD]: "" }), now), { kind: "spam", reason: "too-fast" });
});

test("invalid fields are named", () => {
  const result = parseSubmission(form({ name: "", phone: "12", email: "not-an-email", locale: "de" }), now);
  assert.equal(result.kind, "invalid");
  assert.deepEqual(result.kind === "invalid" && [...result.fields].sort(), ["email", "locale", "name", "phone"]);
});

test("a page that is not a site path is rejected", () => {
  const result = parseSubmission(form({ page: "https://evil.example/" }), now);
  assert.deepEqual(result, { kind: "invalid", fields: ["page"] });
});

test("the e-mail escapes HTML and sets reply-to only with a visitor email", () => {
  const parsed = parseSubmission(form({ message: "<script>x</script>", email: "a@b.ua" }), now);
  assert.equal(parsed.kind, "valid");
  if (parsed.kind !== "valid") return;
  const email = buildEnquiryEmail(parsed.enquiry, "https://labwell.vercel.app/");
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.text, /Сторінка: https:\/\/labwell\.vercel\.app\/uk\/products\/maglumi-x8/);
  assert.equal(email.replyTo, "a@b.ua");

  const withoutEmail = parseSubmission(form(), now);
  assert.equal(withoutEmail.kind === "valid" && buildEnquiryEmail(withoutEmail.enquiry, "https://x").replyTo, undefined);
});

test("sendEnquiry posts to Resend, reports missing configuration and failures", async () => {
  const parsed = parseSubmission(form({ email: "a@b.ua" }), now);
  assert.equal(parsed.kind, "valid");
  if (parsed.kind !== "valid") return;
  const email = buildEnquiryEmail(parsed.enquiry, "https://x");

  const calls: Array<{ url: string; init: RequestInit }> = [];
  const ok = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;

  assert.equal(await sendEnquiry(email, { RESEND_API_KEY: "re_test", CONTACT_FORM_TO: "a@x.ua, b@x.ua" }, ok), "sent");
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const body = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(body.to, ["a@x.ua", "b@x.ua"]);
  assert.equal(body.from, "LabWell <onboarding@resend.dev>");
  assert.equal(body.reply_to, "a@b.ua");

  assert.equal(await sendEnquiry(email, { CONTACT_FORM_TO: "a@x.ua" }, ok), "unconfigured");
  assert.equal(await sendEnquiry(email, { RESEND_API_KEY: "re_test" }, ok), "unconfigured");

  const rejected = (async () => new Response("{}", { status: 422 })) as unknown as typeof fetch;
  assert.equal(await sendEnquiry(email, { RESEND_API_KEY: "re_test", CONTACT_FORM_TO: "a@x.ua" }, rejected), "failed");
  const broken = (async () => {
    throw new Error("network");
  }) as unknown as typeof fetch;
  assert.equal(await sendEnquiry(email, { RESEND_API_KEY: "re_test", CONTACT_FORM_TO: "a@x.ua" }, broken), "failed");
});
