"use client";

import type { ComponentProps, MouseEvent } from "react";

import { LabLink } from "@/components/ui/primitives";

/**
 * Puts `text` into the message field of the contact form (`#contact`).
 * The field is uncontrolled, so setting its value is enough. The user's own text is never
 * overwritten: only an empty field, the form's default prefill, or our previous prefill is replaced.
 */
export function prefillContactMessage(text: string) {
  const field = document.querySelector<HTMLTextAreaElement>('#contact textarea[name="message"]');
  if (!field) return;
  const untouched = field.value.trim() === "" || field.value === field.defaultValue || field.value === field.dataset.prefilled;
  if (!untouched) return;
  field.value = text;
  field.dataset.prefilled = text;
}

/** A link to the contact form that prefills the message ("Interested in MAGLUMI 600"). Without JS it just scrolls to the form. */
export function PrefillLink({
  message,
  onClick,
  ...props
}: ComponentProps<typeof LabLink> & { message: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    prefillContactMessage(message);
    onClick?.(event);
  }
  return <LabLink {...props} onClick={handleClick} />;
}
