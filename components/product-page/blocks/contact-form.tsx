"use client";

import { useRef, useState, type FormEvent } from "react";

import globalStyles from "@/components/labwell-ui.module.css";
import { Button, TextField } from "@/components/ui/primitives";
import type { ContactModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";

type Field = ContactModel["fields"][number];
type Errors = Partial<Record<Field["name"], string>>;

export type ContactFormMessages = { required: string; phone: string; email: string };

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
 * Contact form: markup and client-side validation only.
 * TODO(form-submission): the button does not send anything yet. Sending is a separate
 * task (see _tasks/02-build-T.md, "Журнал" → "Що лишилося"): Server Action / API route,
 * email delivery, spam protection, success and error states.
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
  consent?: string;
  messagePrefill?: string;
  messages: ContactFormMessages;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields, new FormData(event.currentTarget), messages);
    setErrors(nextErrors);

    const firstInvalid = fields.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
    }
    // Valid data is intentionally not sent anywhere (see TODO above).
  }

  function clearError(name: Field["name"]) {
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
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
        {consent ? <p className={styles.consent}>{consent}</p> : null}
        <Button type="submit" size="lg" className={styles.submit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
