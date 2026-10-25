import { Header } from "@/components/site/header";
import { Banner } from "@/components/site/sections/banner";
import { Contact } from "@/components/site/sections/contact";
import { Film } from "@/components/site/sections/film";
import { Footer } from "@/components/site/sections/footer";
import { Hero } from "@/components/site/sections/hero";
import { Process } from "@/components/site/sections/process";
import { Services } from "@/components/site/sections/services";
import { Stats } from "@/components/site/sections/stats";
import { Story } from "@/components/site/sections/story";
import { CapabilityTicker, ClientTicker } from "@/components/site/sections/ticker";
import { Work } from "@/components/site/sections/work";

export default function Page() {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <CapabilityTicker />
        <Banner />
        <Story />
        <Work />
        <Stats />
        <Services />
        <Process />
        <ClientTicker />
        <Film />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
