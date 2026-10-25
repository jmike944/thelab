import type { Metadata, Viewport } from "next";
import { Covered_By_Your_Grace, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/site/motion-provider";
import { GooFilters } from "@/components/site/ui/goo";
import { PAUSE_KEY } from "@/components/site/ui/pause-key";
import "./globals.css";

// Brand faces: LAB (compressed caps) for display, CommonWealth for text.
// JetBrains Mono carries labels and chips; Covered By Your Grace the hand notes.
const lab = localFont({
  src: "../public/fonts/LAB-Regular.woff2",
  variable: "--font-lab",
  display: "swap",
});
const commonwealth = localFont({
  src: "../public/fonts/CommonWealth_SF.otf",
  variable: "--font-cw",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});
const hand = Covered_By_Your_Grace({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Lab® — Creative worth. Estudio de contenido en Saltillo",
  description:
    "The Lab es un estudio de contenido en Saltillo, Coahuila. Contenido viral, cobertura de eventos, foto, video y community management para restaurantes y experiencias.",
};

export const viewport: Viewport = {
  themeColor: "#efebe3",
};

// Scroll scenes only run when motion is allowed. The class goes on before
// first paint so nothing jumps, and comes off again if the app hasn't hydrated
// within 3s; every hidden-until-animated state is scoped under .motion, so the
// page is never stuck invisible. A reader who paused the animations last time
// (components/site/ui/pause.tsx) gets them paused from the first frame.
const motionBoot = `(()=>{try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("motion");try{if(localStorage.getItem("${PAUSE_KEY}")==="1")d.classList.add("is-paused")}catch(_){}setTimeout(function(){if(!window.__labReady)d.classList.remove("motion")},3000)}catch(_){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-MX"
      className={`${lab.variable} ${commonwealth.variable} ${mono.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <GooFilters />
        <MotionProvider />
        {children}
      </body>
    </html>
  );
}
