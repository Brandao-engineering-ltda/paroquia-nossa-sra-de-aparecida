"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowLeft, Ticket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerDetailProps {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  imageUrl: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  gradient: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function AnimatedItem({
  children,
  delay = 0,
  from = "bottom",
  visible,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "bottom" | "left";
  visible: boolean;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate(0, 0)"
          : from === "left"
          ? "translateX(-20px)"
          : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function DestaqueDetail({ banner }: { banner: BannerDetailProps }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so CSS transitions actually animate on page load
    const id = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(id);
  }, []);

  const buyUrl =
    banner.ctaUrl ?? "https://nomineingressos.com/pnsa_mga/show-2026";
  const buyLabel = banner.ctaText ?? "Comprar Ingressos";

  const hasDetails =
    banner.date || banner.startTime || banner.endTime || banner.location;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative h-[65vh] min-h-[420px] overflow-hidden">
        {/* Background layers */}
        {banner.imageUrl && (
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-[2s] ease-out"
            style={{
              backgroundImage: `url(${banner.imageUrl})`,
              transform: visible ? "scale(1)" : "scale(1.05)",
            }}
          />
        )}

        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            banner.gradient,
            banner.imageUrl ? "opacity-75" : "opacity-100"
          )}
        />

        {banner.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        )}

        {/* Decorative blobs */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Back button */}
        <div
          className="absolute left-4 top-4 z-20 sm:left-8 sm:top-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-12px)",
            transition: "opacity 0.5s ease 100ms, transform 0.5s ease 100ms",
          }}
        >
          <Link
            href="/#eventos"
            className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-black/55 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-12 sm:pb-14">
          {banner.date && (
            <AnimatedItem delay={150} visible={visible}>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                <CalendarDays className="h-3 w-3" />
                {formatDate(banner.date)}
              </span>
            </AnimatedItem>
          )}

          {banner.subtitle && (
            <AnimatedItem delay={250} visible={visible}>
              <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/60">
                {banner.subtitle}
              </p>
            </AnimatedItem>
          )}

          <AnimatedItem delay={350} visible={visible}>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {banner.title}
            </h1>
          </AnimatedItem>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

        {/* Description */}
        <AnimatedItem delay={450} visible={visible}>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            {banner.description}
          </p>
        </AnimatedItem>

        {/* Details card */}
        {hasDetails && (
          <AnimatedItem delay={550} visible={visible}>
            <div className="mb-10 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
              <div className="border-b border-border/50 px-6 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Informações
                </p>
              </div>

              <div className="divide-y divide-border/40">
                {banner.date && (
                  <AnimatedItem delay={600} from="left" visible={visible}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
                        <CalendarDays className="h-5 w-5 text-royal" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Data</p>
                        <p className="font-semibold text-foreground">
                          {formatDate(banner.date)}
                        </p>
                      </div>
                    </div>
                  </AnimatedItem>
                )}

                {(banner.startTime || banner.endTime) && (
                  <AnimatedItem delay={680} from="left" visible={visible}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
                        <Clock className="h-5 w-5 text-royal" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Horário</p>
                        <p className="font-semibold text-foreground">
                          {banner.startTime}
                          {banner.endTime && ` — ${banner.endTime}`}
                        </p>
                      </div>
                    </div>
                  </AnimatedItem>
                )}

                {banner.location && (
                  <AnimatedItem delay={760} from="left" visible={visible}>
                    <div className="flex items-center gap-4 px-6 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal/10">
                        <MapPin className="h-5 w-5 text-royal" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Local</p>
                        <p className="font-semibold text-foreground">
                          {banner.location}
                        </p>
                      </div>
                    </div>
                  </AnimatedItem>
                )}
              </div>
            </div>
          </AnimatedItem>
        )}

        {/* Buy button */}
        <AnimatedItem delay={850} visible={visible}>
          <div
            style={{
              transform: visible ? "scale(1)" : "scale(0.95)",
              transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 850ms`,
            }}
          >
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Button
                size="lg"
                className={cn(
                  "w-full gap-3 py-7 text-lg font-bold",
                  "bg-[#C9A84C] text-[#1A3268] hover:bg-[#b8963f]",
                  "transition-all duration-300",
                  "hover:shadow-[0_4px_32px_rgba(201,168,76,0.45)] hover:scale-[1.02]",
                  "active:scale-[0.98]"
                )}
              >
                <Ticket className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                {buyLabel}
                <ExternalLink className="ml-auto h-4 w-4 opacity-60" />
              </Button>
            </a>
          </div>
        </AnimatedItem>
      </div>
    </div>
  );
}
