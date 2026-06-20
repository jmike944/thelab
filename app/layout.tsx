import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE LAB® — Creative Worth · Estudio de contenido en Saltillo",
  description:
    "The Lab MX — estudio de contenido en Saltillo, Coahuila. Contenido viral, cobertura de eventos, fotografía, video y community management para restaurantes y experiencias.",
};

const themeBoot = `(() => { try { var m = localStorage.getItem("lab-site-theme"); var dark = m === "signal" || ((m === "system" || m === null) && window.matchMedia("(prefers-color-scheme: dark)").matches); if (dark) document.documentElement.setAttribute("data-theme", "signal"); } catch (_) {} })();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
