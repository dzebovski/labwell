import type { ReactNode } from "react";

import { onest } from "@/app/fonts";

import "../globals.css";

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${onest.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
