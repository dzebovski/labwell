"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";

import { submitContact } from "@/app/actions/contact";
import globalStyles from "@/components/labwell-ui.module.css";
import { Button, TextField } from "@/components/ui/primitives";
import { isLocale } from "@/i18n/config";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/contact-form";
import { withLocale } from "@/lib/locale-routing";
import type { ContactModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

type Field = ContactModel["fields"][number];
type Errors = Partial<Record<Field["name"], string>>;

export type ContactFormMessages = {
  required: string;
  phone: string;
  email: string;
  sending: string;
  sent: string;
  failed: string;
  testMode: string;
};

type Status = "idle" | "sent" | "failed" | "unconfigured";

const phonePattern = /^\+?[\d\s()\-.]{7,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(fields: Field[], data: FormData, messages: ContactFormMessages): Errors {
  const errors: Errors = {};
  for (const field of fields) {
    const value = String(data.get(field.name) ?? "").trim();
    if (!value) {
      if (field.required) errors[field.name] = messages.required;
      continue;
    }
    if (field.name === "phone" && (!phonePattern.test(value) || value.replace(/\D/g, "").length < 7)) {
      errors.phone = messages.phone;
    }
    if (field.name === "email" && !emailPattern.test(value)) errors.email = messages.email;
  }
  return errors;
}

/**
 * Contact form: client-side validation, then the `submitContact` Server Action (validation,
 * spam checks and e-mail on the server, see lib/contact-form.ts). Hidden fields: a honeypot,
 * the render time and the page the enquiry came from.
 */
export function ContactForm({
  fields,
  submitLabel,
  consent,
  messagePrefill,
  messages,
}: {
  fields: Field[];
  submitLabel: string;
  consent?: ContactModel["consent"];
  messagePrefill?: string;
  messages: ContactFormMessages;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [pending, startTransition] = useTransition();
  // Set after hydration: the server-rendered HTML must not carry a fixed time.
  const startedAt = useRef(0);
  const page = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && isLocale(params.locale) ? params.locale : "uk";

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const consentHref = consent?.link
    ? params.locale && isLocale(params.locale) && consent.link.href.startsWith("/")
      ? withLocale(params.locale, consent.link.href)
      : consent.link.href
    : undefined;
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set(STARTED_AT_FIELD, startedAt.current ? String(startedAt.current) : "");
    const nextErrors = validate(fields, data, messages);
    setErrors(nextErrors);

    const firstInvalid = fields.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      setStatus("idle");
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitContact(data);
        if (result.status === "sent") {
          setStatus("sent");
          form.reset();
          startedAt.current = Date.now();
        } else if (result.status === "unconfigured") {
          setStatus("unconfigured");
        } else if (result.status === "invalid") {
          const serverErrors: Errors = {};
          for (const name of result.fields ?? []) {
            const known = fields.find((item) => item.name === name);
            if (known) serverErrors[known.name] = name === "phone" ? messages.phone : name === "email" ? messages.email : messages.required;
          }
          setErrors(serverErrors);
          setStatus(Object.keys(serverErrors).length ? "idle" : "failed");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    });
  }

  function clearError(name: Field["name"]) {
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="page" value={page} />
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {fields.map((field) => {
        const id = `contact-${field.name}`;
        const label = field.required ? `${field.label} *` : field.label;
        const wide = field.name === "email" || field.name === "message";
        const className = wide ? styles.formWide : undefined;

        if (field.type === "textarea") {
          const messageId = `${id}-error`;
          return (
            <div key={field.name} className={`${globalStyles.fieldGroup} ${className ?? ""}`}>
              <label htmlFor={id} className={globalStyles.fieldLabel}>
                {label}
              </label>
              <div className={`${globalStyles.inputShell} ${errors[field.name] ? globalStyles.inputShellError : ""}`}>
                <textarea
                  id={id}
                  name={field.name}
                  rows={4}
                  defaultValue={field.name === "message" ? messagePrefill : undefined}
                  className={styles.textarea}
                  aria-invalid={Boolean(errors[field.name])}
                  aria-describedby={errors[field.name] ? messageId : undefined}
                  onChange={() => clearError(field.name)}
                />
              </div>
              {errors[field.name] ? (
                <p id={messageId} className={globalStyles.fieldError}>
                  {errors[field.name]}
                </p>
              ) : null}
            </div>
          );
        }

        return (
          <TextField
            key={field.name}
            id={id}
            name={field.name}
            type={field.type}
            label={label}
            required={field.required}
            autoComplete={field.name === "name" ? "name" : field.name === "phone" ? "tel" : field.name === "email" ? "email" : undefined}
            inputMode={field.type === "tel" ? "tel" : undefined}
            error={errors[field.name]}
            containerClassName={className}
            onChange={() => clearError(field.name)}
          />
        );
      })}

      <div className={`${styles.formWide} ${styles.formFoot}`}>
        {consent ? (
          <p className={styles.consent}>
            {consent.before}
            {consent.link && consentHref ? <Link href={consentHref}>{consent.link.label}</Link> : null}
            {consent.after}
          </p>
        ) : null}
        <Button type="submit" size="lg" className={styles.submit} disabled={pending}>
          {pending ? messages.sending : submitLabel}
        </Button>
        <p
          role="status"
          className={styles.formStatus}
          data-tone={status === "failed" ? "error" : undefined}
          hidden={status === "idle"}
        >
          {status === "sent" ? messages.sent : status === "failed" ? messages.failed : status === "unconfigured" ? messages.testMode : ""}
        </p>
      </div>
    </form>
  );
}
