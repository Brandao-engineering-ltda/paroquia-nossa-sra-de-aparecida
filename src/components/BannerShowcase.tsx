"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BannerData {
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

function BannerCard({
  banner,
  index,
  isActive,
}: {
  banner: BannerData;
  index: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative flex-shrink-0 snap-center transition-all duration-700",
        "w-[85vw] sm:w-[70vw] md:w-[550px] lg:w-[600px]",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0",
        isActive ? "scale-100" : "scale-[0.92] opacity-60"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link href={`/destaques/${banner.id}`} className="block group/card">
      <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl cursor-pointer transition-all duration-300 group-hover/card:ring-2 group-hover/card:ring-white/30 group-hover/card:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        {/* Background image (base layer) */}
        {banner.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          />
        )}

        {/* Gradient overlay */}
        {banner.gradient !== "none" && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              banner.gradient,
              banner.imageUrl ? "opacity-70" : "opacity-100"
            )}
          />
        )}

        {/* Dark scrim for text readability when image is present */}
        {banner.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        )}

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        {/* Shimmering line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 flex min-h-[320px] flex-col justify-between p-6 sm:min-h-[360px] sm:p-8">
          {/* Top: Badge */}
          {banner.date && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                <CalendarDays className="h-3 w-3" />
                {formatDate(banner.date)}
              </span>
            </div>
          )}

          {/* Center: Content */}
          <div className="flex-1">
            {banner.subtitle && (
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gold-light/80">
                {banner.subtitle}
              </p>
            )}
            <h3 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {banner.title}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              {banner.description}
            </p>
          </div>

          {/* Bottom: Meta + Ver detalhes */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              {(banner.startTime || banner.endTime) && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {banner.startTime}
                    {banner.endTime && ` — ${banner.endTime}`}
                  </span>
                </div>
              )}
              {banner.location && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{banner.location}</span>
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-all duration-300 group-hover/card:text-white">
              Ver detalhes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-1" />
            </span>
          </div>
        </div>

      </div>
      </Link>
    </div>
  );
}

export function BannerShowcase({ banners }: { banners: BannerData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Section entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track active card on scroll
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || banners.length === 0) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let closestDistance = Infinity;

    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  }, [banners.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function scrollTo(direction: "prev" | "next") {
    const container = scrollRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const targetIndex =
      direction === "next"
        ? Math.min(activeIndex + 1, children.length - 1)
        : Math.max(activeIndex - 1, 0);
    children[targetIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  if (banners.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="eventos"
      className="relative overflow-hidden bg-background py-16 sm:py-20"
    >
      {/* Background decorative */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-royal/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div
          className={cn(
            "mx-auto max-w-7xl px-4 text-center transition-all duration-700 sm:px-6 lg:px-8",
            sectionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal">
            <CalendarDays className="h-4 w-4" />
            Destaques
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Próximos Eventos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fique por dentro das atividades e celebrações da nossa comunidade.
          </p>
        </div>

        {/* Carousel */}
        <div
          className={cn(
            "mt-10 transition-all delay-200 duration-700",
            sectionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          )}
        >
          <div
            ref={scrollRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1rem,calc((100vw-600px)/2))] pb-4"
          >
            {banners.map((banner, i) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                index={i}
                isActive={i === activeIndex}
              />
            ))}
          </div>

          {/* Navigation + Dots */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {banners.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/50 text-foreground"
                  onClick={() => scrollTo("prev")}
                  disabled={activeIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const container = scrollRef.current;
                        const children = Array.from(container?.children ?? []) as HTMLElement[];
                        children[i]?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      }}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === activeIndex
                          ? "w-6 bg-gold"
                          : "w-2 bg-foreground/20 hover:bg-foreground/40"
                      )}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/50 text-foreground"
                  onClick={() => scrollTo("next")}
                  disabled={activeIndex === banners.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
