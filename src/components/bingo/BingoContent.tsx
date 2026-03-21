"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Gift,
  Ticket,
  Star,
  Trophy,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIZES = [
  {
    icon: Trophy,
    place: "1º Prêmio",
    description: "Prêmio principal — a ser divulgado",
  },
  {
    icon: Star,
    place: "2º Prêmio",
    description: "Prêmio especial — a ser divulgado",
  },
  {
    icon: Gift,
    place: "3º Prêmio",
    description: "Prêmio surpresa — a ser divulgado",
  },
];

export function BingoContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 20%, rgba(201,168,76,0.3) 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% 15%, rgba(254,234,165,0.15) 0%, transparent 50%),
            linear-gradient(
              180deg,
              #1A3268 0%,
              #2968A9 40%,
              #1A3268 100%
            )
          `,
        }}
      >
        {/* Decorative floating bingo balls */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-[10%] top-[15%] h-16 w-16 rounded-full border-2 border-gold/20 bg-gold/10 backdrop-blur-sm sm:h-24 sm:w-24"
            style={{ animation: "float-slow 8s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[15%] top-[25%] h-12 w-12 rounded-full border-2 border-white/15 bg-white/5 backdrop-blur-sm sm:h-20 sm:w-20"
            style={{ animation: "float-slow 10s ease-in-out infinite 2s" }}
          />
          <div
            className="absolute bottom-[20%] left-[20%] h-10 w-10 rounded-full border-2 border-gold/15 bg-gold/5 backdrop-blur-sm sm:h-16 sm:w-16"
            style={{ animation: "float-slow 9s ease-in-out infinite 4s" }}
          />
          <div
            className="absolute bottom-[30%] right-[10%] h-14 w-14 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm sm:h-18 sm:w-18"
            style={{ animation: "float-slow 11s ease-in-out infinite 1s" }}
          />
        </div>

        {/* Warm glow */}
        <div className="pointer-events-none absolute left-1/2 top-[10%] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold/10 blur-[100px]" />

        {/* Edge vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 40%, rgba(26,50,104,0.6) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-28 text-center sm:px-6 sm:py-32 lg:px-8">
          {/* Back link */}
          <Link
            href="/#eventos"
            className="absolute left-4 top-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white sm:left-6 sm:top-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 text-sm font-medium text-gold-light backdrop-blur-sm">
            <Ticket className="h-4 w-4" />
            Evento Beneficente
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Bingo
            <span className="block text-gold-light">Beneficente</span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-light-blue/90 sm:text-xl">
            Venha participar do nosso Bingo Beneficente! Toda a renda será
            revertida para as obras sociais da Paróquia Nossa Senhora Aparecida.
            Diversão e solidariedade em uma noite especial!
          </p>

          {/* Event details pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <CalendarDays className="h-4 w-4 text-gold-light" />
              Data a confirmar
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Clock className="h-4 w-4 text-gold-light" />
              Horário a confirmar
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-gold-light" />
              Salão Paroquial
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-gold/25 transition-all hover:bg-gold-dark hover:shadow-gold/40"
            >
              <a href="#comprar">
                <Ticket className="mr-2 h-5 w-5" />
                Comprar Cartela
              </a>
            </Button>
            <p className="text-sm text-white/50">
              Pagamento via Pix ou Cartão de Crédito
            </p>
          </div>
        </div>
      </section>

      {/* Info + Prizes Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark dark:text-gold-light">
              <Gift className="h-4 w-4" />
              Prêmios
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Concorra a Prêmios Incríveis
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Cada cartela é uma chance de ganhar! Confira os prêmios desta
              edição do nosso Bingo Beneficente.
            </p>
          </div>

          {/* Prize cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PRIZES.map((prize) => (
              <div
                key={prize.place}
                className="group flex flex-col items-center rounded-2xl border border-border/50 bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-royal to-navy text-white transition-transform duration-300 group-hover:scale-110">
                  <prize.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {prize.place}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {prize.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Section */}
      <section id="comprar" className="bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center shadow-sm sm:p-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark dark:text-gold-light">
              <Heart className="h-4 w-4" />
              Solidariedade
            </div>

            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
              Adquira sua Cartela
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Sua participação faz a diferença! Toda a renda arrecadada será
              destinada às obras sociais e melhorias da nossa paróquia.
            </p>

            {/* Price card */}
            <div className="mx-auto mb-8 max-w-xs rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 p-6">
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Cartela
              </p>
              <p className="text-4xl font-bold text-foreground">
                R$ <span className="text-gold-dark dark:text-gold-light">--</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Valor a ser definido
              </p>
            </div>

            {/* Payment placeholder — ready for 3rd party integration */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full max-w-sm bg-gold text-lg font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-dark hover:shadow-gold/30 sm:w-auto sm:px-12"
                disabled
              >
                <Ticket className="mr-2 h-5 w-5" />
                Comprar via Pix ou Cartão
              </Button>
              <p className="text-xs text-muted-foreground">
                O pagamento online estará disponível em breve.
                <br />
                Aceitamos Pix e Cartão de Crédito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-muted-foreground">
            Dúvidas? Entre em contato com a secretaria da paróquia.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-4">
            <Link href="/#contato">Fale Conosco</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
