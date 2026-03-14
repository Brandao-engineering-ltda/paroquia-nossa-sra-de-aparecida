"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiturgiaData {
  liturgia: string;
  cor: string;
  verso: string;
  referencia: string;
}

const COR_STYLES: Record<string, { dot: string; border: string; bg: string }> = {
  Roxo: { dot: "bg-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/10" },
  Branco: { dot: "bg-white", border: "border-white/30", bg: "bg-white/10" },
  Verde: { dot: "bg-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10" },
  Vermelho: { dot: "bg-red-400", border: "border-red-400/30", bg: "bg-red-400/10" },
  Rosa: { dot: "bg-pink-400", border: "border-pink-400/30", bg: "bg-pink-400/10" },
};

function getCorStyle(cor: string) {
  return COR_STYLES[cor] || COR_STYLES.Branco;
}

export function HeroSection() {
  const [liturgia, setLiturgia] = useState<LiturgiaData | null>(null);

  useEffect(() => {
    fetch("/api/liturgia")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !data.error) setLiturgia(data); })
      .catch(() => {});
  }, []);

  const corStyle = liturgia ? getCorStyle(liturgia.cor) : null;

  return (
    <section
      id="inicio"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-24 sm:pt-28"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% 15%, rgba(201,168,76,0.25) 0%, transparent 60%),
          radial-gradient(ellipse 80% 50% at 50% 10%, rgba(254,234,165,0.15) 0%, transparent 50%),
          conic-gradient(
            from 180deg at 50% 15%,
            #1A3268 0deg,
            #1A3268 120deg,
            #2968A9 150deg,
            #C9A84C 170deg,
            #feeaa5 180deg,
            #C9A84C 190deg,
            #2968A9 210deg,
            #1A3268 240deg,
            #1A3268 360deg
          )
        `,
      }}
    >
      {/* Sun ray beams — primary, slow rotation */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transformOrigin: "50% 57.5%",
          animation: "sun-rays-rotate 120s linear infinite, sun-rays-pulse 8s ease-in-out infinite",
          backgroundImage: `repeating-conic-gradient(
            from 0deg at 50% 57.5%,
            transparent 0deg,
            rgba(254,234,165,0.8) 1.2deg,
            transparent 2.4deg,
            transparent 15deg
          )`,
        }}
      />

      {/* Sun ray beams — secondary, counter-rotation for depth */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transformOrigin: "50% 57.5%",
          animation: "sun-rays-counter 90s linear infinite",
          opacity: 0.04,
          backgroundImage: `repeating-conic-gradient(
            from 6deg at 50% 57.5%,
            transparent 0deg,
            rgba(254,234,165,0.6) 0.8deg,
            transparent 1.6deg,
            transparent 10deg
          )`,
        }}
      />

      {/* Shimmer layer — slow drift overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          animation: "sun-shimmer 12s ease-in-out infinite",
          transformOrigin: "50% 15%",
          backgroundImage: `conic-gradient(
            from 170deg at 50% 15%,
            transparent 0deg,
            rgba(254,234,165,0.3) 175deg,
            rgba(255,255,255,0.2) 180deg,
            rgba(254,234,165,0.3) 185deg,
            transparent 360deg
          )`,
        }}
      />

      {/* Warm ambient glow at the sun origin — breathing */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] rounded-full bg-gold/10 blur-[100px]"
        style={{
          animation: "sun-glow-breathe 6s ease-in-out infinite",
        }}
      />

      {/* Edge vignette to darken corners */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 30%, transparent 40%, rgba(26,50,104,0.6) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="relative">
          {/* Soft glow behind the logo */}
          <div className="absolute inset-0 scale-75 rounded-full bg-sky/15 blur-3xl" />
          <div className="absolute inset-0 scale-50 rounded-full bg-white/10 blur-2xl" />
          <Image
            src="/images/logo-nsa.png"
            alt="Paróquia Nossa Senhora Aparecida — Jubileu 25 Anos"
            width={400}
            height={400}
            className="relative h-52 w-auto mix-blend-lighten sm:h-[26rem]"
            style={{
              maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 45%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 45%, transparent 90%)",
            }}
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Paróquia Nossa Senhora
            <span className="block text-gold-light">Aparecida</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-light-blue/90 sm:text-xl">
            Celebrando 25 anos de fé, comunidade e amor em Maringá — PR.
            <br />
            Venha fazer parte da nossa família!
          </p>
        </div>

        {/* Liturgical verse */}
        {liturgia && liturgia.verso && (
          <div
            className={cn(
              "mx-auto max-w-xl animate-[fade-in-up_0.8s_ease-out_both] rounded-2xl border px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5",
              corStyle?.border,
              corStyle?.bg
            )}
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", corStyle?.dot)} />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {liturgia.liturgia}
              </span>
              <span className={cn("h-2 w-2 rounded-full", corStyle?.dot)} />
            </div>
            <blockquote className="text-base italic leading-relaxed text-white/90 sm:text-lg">
              <BookOpen className="mr-1.5 inline-block h-4 w-4 text-gold-light/70" />
              &ldquo;{liturgia.verso}&rdquo;
            </blockquote>
            <cite className="mt-2 block text-sm font-medium not-italic text-gold-light/80">
              — {liturgia.referencia}
            </cite>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-gold text-white hover:bg-gold-dark"
          >
            <a href="#horarios">Horários das Missas</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            <a href="#sobre">Conheça a Paróquia</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#horarios"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 transition-colors hover:text-white"
      >
        <ChevronDown className="h-8 w-8" />
      </a>
    </section>
  );
}
