import React from "react";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Overview from "@/components/site/Overview";
import HowItWorks from "@/components/site/HowItWorks";
import Benefits from "@/components/site/Benefits";
import Specs from "@/components/site/Specs";
import Industries from "@/components/site/Industries";
import Trust from "@/components/site/Trust";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Landing() {
  return (
    <div data-testid="landing-page" className="relative z-10">
      <Header />
      <main>
        <Hero />
        <Overview />
        <HowItWorks />
        <Benefits />
        <Specs />
        <Industries />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
