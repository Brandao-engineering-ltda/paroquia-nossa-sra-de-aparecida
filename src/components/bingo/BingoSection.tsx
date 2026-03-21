"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Ticket, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BingoSectionProps {
  bingo: {
    id: string;
    title: string;
    description: string;
    date: string | null;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    imageUrl: string | null;
    price: number | null;
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function BingoSection({ bingo }: BingoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-navy via-[#1e3a5f] to-navy py-16 sm:py-24"
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[5%] top-[10%] h-32 w-32 rounded-full bg-gold/5 blur-3xl"
          style={{ animation: "float-slow 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[10%] right-[5%] h-40 w-40 rounded-full bg-royal/10 blur-3xl"
          style={{ animation: "float-slow 12s ease-in-out infinite 3s" }}
        />
        <div
          className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        />
        <div
          className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Image */}
          <div
            className={cn(
              "transition-all duration-1000 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            )}
          >
            {bingo.imageUrl ? (
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
                <Image
                  src={bingo.imageUrl}
                  alt={bingo.title}
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-royal/20 to-navy/40 shadow-2xl shadow-black/30">
                <div className="text-center">
                  <span className="text-7xl">🎱</span>
                  <p className="mt-4 text-lg font-medium text-white/50">
                    Bingo Beneficente
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div
            className={cn(
              "transition-all delay-200 duration-1000 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            )}
          >
            {/* Badge */}
            <div
              className={cn(
                "mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light transition-all delay-300 duration-700",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <Ticket className="h-4 w-4" />
              Evento Especial
            </div>

            {/* Title */}
            <h2
              className={cn(
                "mb-4 text-3xl font-bold tracking-tight text-white transition-all delay-400 duration-700 sm:text-4xl lg:text-5xl",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {bingo.title}
            </h2>

            {/* Description */}
            <p
              className={cn(
                "mb-6 text-lg leading-relaxed text-light-blue/80 transition-all delay-500 duration-700",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {bingo.description}
            </p>

            {/* Info pills */}
            <div
              className={cn(
                "mb-8 flex flex-wrap gap-3 transition-all delay-[600ms] duration-700",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {bingo.date && (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <CalendarDays className="h-4 w-4 text-gold-light" />
                  <span className="capitalize">{formatDate(bingo.date)}</span>
                </div>
              )}
              {bingo.startTime && (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-gold-light" />
                  {bingo.startTime}
                  {bingo.endTime && ` — ${bingo.endTime}`}
                </div>
              )}
              {bingo.location && (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-gold-light" />
                  {bingo.location}
                </div>
              )}
              {bingo.price != null && (
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light backdrop-blur-sm">
                  <Ticket className="h-4 w-4" />
                  {formatPrice(bingo.price)} / cartela
                </div>
              )}
            </div>

            {/* CTA */}
            <div
              className={cn(
                "transition-all delay-700 duration-700",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <Link
                href="/bingo"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:bg-gold-dark hover:shadow-xl hover:shadow-gold/30 active:scale-95"
              >
                <Ticket className="h-5 w-5" />
                Comprar Cartela
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-3 text-sm text-white/40">
                Pagamento via Pix ou Cartão de Crédito
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
