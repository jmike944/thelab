import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE LAB® — Creative Worth · Estudio de contenido en Saltillo",
  description:
    "The Lab MX — estudio de contenido en Saltillo, Coahuila. Contenido viral, cobertura de eventos, fotografía, video y community management para restaurantes y experiencias.",
};

const themeBoot = `(() => { try { var r = document.documentElement; var m = localStorage.getItem("lab-site-theme"); var dark = m === "signal" || ((m === "system" || m === null) && window.matchMedia("(prefers-color-scheme: dark)").matches); if (dark) r.setAttribute("data-theme", "signal"); var P = {blue:["#3537ff","#feff1f"],magenta:["#ff0074","#00cfff"],red:["#ee1708","#3ac62f"],violet:["#8a00ff","#ff9000"]}; var ac = localStorage.getItem("lab-site-accent"); var k = (ac && P[ac]) ? ac : "blue"; r.style.setProperty("--hud-accent", dark ? P[k][1] : P[k][0]); r.style.setProperty("--hud-accent-ink", dark ? "#231f20" : "#fffcf7"); } catch (_) {} })();`;

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
