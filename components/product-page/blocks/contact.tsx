import { Mail, Phone } from "lucide-react";

import type { ProductPageModel } from "@/lib/site-content/model";

import styles from "../product-page.module.css";
import { ContactForm, type ContactFormMessages } from "./contact-form";
import { Section } from "./shared";

export function Contact({
  contact,
  labels,
}: {
  contact: NonNullable<ProductPageModel["contact"]>;
  labels: { phone: string; email: string; form: ContactFormMessages };
}) {
  return (
    <Section id="contact" labelledBy="contact-title">
      <div className={`${styles.card} ${styles.contact}`}>
        <div className={styles.contactCopy}>
          <h2 id="contact-title" className={styles.h2}>
            {contact.h2}
          </h2>
          <p className={styles.contactText}>{contact.text}</p>
          {contact.phone || contact.email ? (
            <ul className={styles.contactList}>
              {contact.phone ? (
                <li>
                  <a className={styles.contactLink} href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
                    <Phone size={18} aria-hidden="true" />
                    <span className="sr-only">{labels.phone}: </span>
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a className={styles.contactLink} href={`mailto:${contact.email}`}>
                    <Mail size={18} aria-hidden="true" />
                    <span className="sr-only">{labels.email}: </span>
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <ContactForm
          fields={contact.fields}
          submitLabel={contact.submit}
          consent={contact.consent}
          messagePrefill={contact.messagePrefill}
          messages={labels.form}
        />
      </div>
    </Section>
  );
}
