"use client";

import dynamic from "next/dynamic";
import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { MassScheduleSkeleton } from "@/components/skeletons/MassScheduleSkeleton";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";
import { ContactSkeleton } from "@/components/skeletons/ContactSkeleton";

const Header = dynamic(
  () => import("@/components/Header").then((mod) => ({ default: mod.Header })),
  { loading: () => <HeaderSkeleton /> }
);

const HeroSection = dynamic(
  () => import("@/components/HeroSection").then((mod) => ({ default: mod.HeroSection })),
  { loading: () => <HeroSkeleton /> }
);

const MassScheduleSection = dynamic(
  () => import("@/components/MassScheduleSection").then((mod) => ({ default: mod.MassScheduleSection })),
  { loading: () => <MassScheduleSkeleton /> }
);

const AboutSection = dynamic(
  () => import("@/components/AboutSection").then((mod) => ({ default: mod.AboutSection })),
  { loading: () => <AboutSkeleton /> }
);

const ContactSection = dynamic(
  () => import("@/components/ContactSection").then((mod) => ({ default: mod.ContactSection })),
  { loading: () => <ContactSkeleton /> }
);

const Footer = dynamic(
  () => import("@/components/Footer").then((mod) => ({ default: mod.Footer })),
);

export function HomeContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {children}
        <MassScheduleSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
