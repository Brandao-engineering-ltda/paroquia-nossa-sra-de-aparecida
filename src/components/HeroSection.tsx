"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-royal to-navy pt-24 sm:pt-28"
    >
      {/* Decorative circles */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-4 rounded-[10px] bg-white/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[10px] border border-white/20 bg-white/10 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:p-8">
            <Image
              src="/images/logo-nsa.png"
              alt="Paróquia Nossa Senhora Aparecida — Jubileu 25 Anos"
              width={320}
              height={320}
              className="relative h-44 w-auto rounded-[10px] sm:h-100"
              priority
            />
          </div>
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
