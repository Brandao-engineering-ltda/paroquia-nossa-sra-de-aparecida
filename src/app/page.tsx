"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MassScheduleSection } from "@/components/MassScheduleSection";
import { AboutSection } from "@/components/AboutSection";
import { EventsSection } from "@/components/EventsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MassScheduleSection />
        <AboutSection />
        <EventsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
