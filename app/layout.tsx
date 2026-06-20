import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE LAB® — Creative Worth",
  description:
    "A creative studio for brands that want range — identity, campaigns and content, made in the lab.",
};

const themeBoot = `(() => { try { const t = localStorage.getItem("lab-site-theme"); if (t === "signal") document.documentElement.setAttribute("data-theme", "signal"); } catch (_) {} })();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
