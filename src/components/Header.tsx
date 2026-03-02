"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useParishStore } from "@/store/useParishStore";

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#horarios", label: "Horários" },
  { href: "#sobre", label: "Sobre" },
  { href: "#eventos", label: "Eventos" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useParishStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="overflow-hidden rounded-[10px] border border-border/30 bg-white p-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]">
            <Image
              src="/images/logo-nsa.png"
              alt="Paróquia Nossa Senhora Aparecida"
              width={48}
              height={48}
              className="h-10 w-auto rounded-[10px]"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-navy">
              Paróquia Nossa Senhora
            </p>
            <p className="text-sm font-bold leading-tight text-navy">
              Aparecida
            </p>
            <p className="text-xs text-muted-foreground">Maringá — PR</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-secondary hover:text-royal"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="ml-3 bg-gold text-white hover:bg-gold-dark"
          >
            <Link href="#contato">Fale Conosco</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-md px-4 py-3 text-base font-medium text-navy transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className="mt-4 bg-gold text-white hover:bg-gold-dark"
              >
                <Link href="#contato" onClick={closeMobileMenu}>
                  Fale Conosco
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
