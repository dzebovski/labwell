import { isRedirectedPath } from "./legacy-redirects.ts";
import type { HeaderNavigationItem } from "./site-navigation.ts";
import { publishable } from "./site-content/placeholders.ts";

export type FooterLink = { label: string; href: string };

export type FooterColumn = {
  id: string;
  title: string;
  /** The section's own page, when the title links to it. */
  href?: string;
  links: FooterLink[];
};

export type FooterContacts = { phone?: { label: string; href: string }; email?: { label: string; href: string } };

export type FooterModel = {
  columns: FooterColumn[];
  /** Absent while LabWell's phone and e-mail are placeholders. */
  contacts?: FooterContacts;
};

/** `/uk/products/x` → `/products/x`. */
function pathWithoutLocale(href: string) {
  return href.replace(/^\/(?:uk|en)(?=\/|$)/, "").split("#")[0] || "/";
}

function isLive(link: FooterLink) {
  return !isRedirectedPath(pathWithoutLocale(link.href));
}

function column(id: string, title: string, href: string | undefined, links: FooterLink[]): FooterColumn[] {
  const live = links.filter(isLive);
  return live.length ? [{ id, title, href, links: live }] : [];
}

/**
 * Footer links come from the same navigation data as the header menu, so the two never drift apart.
 * The mega menu opens on the client, so these links are what a crawler sees in the HTML.
 * Phone and e-mail are shown only when they are real values, not `[ТЕЛЕФОН]` placeholders.
 */
export function buildFooter(
  navItems: readonly HeaderNavigationItem[],
  options: { companyTitle: string; contact?: { phone?: string; email?: string } },
): FooterModel {
  const contact = options.contact ?? {};
  const columns: FooterColumn[] = [];
  const company: FooterLink[] = [];

  for (const item of navItems) {
    if (item.type === "link") {
      company.push({ label: item.label, href: item.href });
    } else if (item.panel === "brands") {
      columns.push(
        ...column(
          item.id,
          item.label,
          item.href,
          item.brands.map((brand) => ({ label: brand.label, href: brand.about?.href ?? brand.allHref })),
        ),
      );
    } else {
      columns.push(...column(item.id, item.label, item.href, item.groups.map((group) => ({ label: group.label, href: group.href }))));
    }
  }

  // Services, about and contacts have no section page of their own: one plain column.
  columns.push(...column("company", options.companyTitle, undefined, company));

  const phone = publishable(contact.phone);
  const email = publishable(contact.email);
  const contacts: FooterContacts = {
    ...(phone ? { phone: { label: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` } } : {}),
    ...(email ? { email: { label: email, href: `mailto:${email}` } } : {}),
  };

  return { columns, contacts: phone || email ? contacts : undefined };
}
