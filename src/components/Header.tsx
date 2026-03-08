"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, LogIn, LogOut, CalendarDays, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useParishStore } from "@/store/useParishStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#eventos", label: "Eventos" },
  { href: "#horarios", label: "Horários" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useParishStore();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Track scroll for glassmorphism transition
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section via Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Sliding indicator
  const updateIndicator = useCallback(() => {
    const activeIndex = navLinks.findIndex(
      (l) => l.href === `#${activeSection}`
    );
    const el = linkRefs.current[activeIndex];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "mx-3 h-13 max-w-5xl rounded-2xl border border-white/[0.08] bg-background/70 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:mx-auto dark:border-white/[0.06] dark:bg-background/55 dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
            : "h-16 max-w-7xl bg-transparent px-4 sm:px-6 lg:px-8"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className={cn(
              "overflow-hidden rounded-xl transition-all duration-500",
              scrolled
                ? "border border-border/30 bg-card p-0.5 shadow-sm"
                : "border border-white/20 bg-white/10 p-0.5 backdrop-blur-sm"
            )}
          >
            <Image
              src="/images/logo-nsa.png"
              alt="Paróquia Nossa Senhora Aparecida"
              width={48}
              height={48}
              className={cn(
                "rounded-[10px] transition-all duration-500",
                scrolled ? "h-8 w-auto" : "h-10 w-auto"
              )}
            />
          </div>
          <div className="hidden sm:block">
            <p
              className={cn(
                "text-sm font-bold leading-tight transition-colors duration-500",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              Paróquia Nossa Senhora
            </p>
            <p
              className={cn(
                "text-sm font-bold leading-tight transition-colors duration-500",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              Aparecida
            </p>
            <p
              className={cn(
                "text-xs transition-colors duration-500",
                scrolled ? "text-muted-foreground" : "text-white/60"
              )}
            >
              Maringá — PR
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {/* Nav links with sliding indicator */}
          <div ref={navRef} className="relative flex items-center">
            {/* Sliding indicator */}
            <div
              className="absolute top-0 h-full"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                transition:
                  "left 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
              }}
            >
              <div
                className={cn(
                  "h-full rounded-lg transition-colors duration-500",
                  scrolled ? "bg-royal/10" : "bg-white/15"
                )}
              />
            </div>

            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  className={cn(
                    "relative z-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300",
                    scrolled
                      ? isActive
                        ? "text-royal"
                        : "text-foreground/70 hover:text-foreground"
                      : isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white/90"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div
            className={cn(
              "mx-2 h-5 w-px transition-colors duration-500",
              scrolled ? "bg-border" : "bg-white/20"
            )}
          />

          {/* Auth actions */}
          {session ? (
            <>
              <Link
                href="/calendario"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-300",
                  scrolled
                    ? "text-foreground/70 hover:bg-secondary hover:text-foreground"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Calendário
              </Link>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-300",
                    scrolled
                      ? "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "ml-0.5 transition-colors duration-500",
                  scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-1 h-3.5 w-3.5" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                asChild
                size="sm"
                className="ml-1.5 bg-gold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-dark hover:shadow-gold/30"
              >
                <Link href="/login">
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Entrar
                </Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-500",
                  scrolled
                    ? "text-foreground"
                    : "text-white hover:bg-white/10"
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      activeSection === link.href.replace("#", "")
                        ? "bg-royal/10 text-royal"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {session ? (
                  <>
                    <Link
                      href="/calendario"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Calendário
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="mt-2 justify-start px-4 text-muted-foreground"
                      onClick={() => {
                        closeMobileMenu();
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    className="mt-4 bg-gold text-white hover:bg-gold-dark"
                  >
                    <Link href="/login" onClick={closeMobileMenu}>
                      <LogIn className="mr-1.5 h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
