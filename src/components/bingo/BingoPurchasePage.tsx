"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  QrCode,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BingoPurchasePageProps {
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
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function BingoPurchasePage({ bingo }: BingoPurchasePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div
        className="relative flex min-h-[40vh] items-end overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg, #1A3268 0%, #2968A9 50%, #1A3268 100%)
          `,
        }}
      >
        {bingo.imageUrl && (
          <Image
            src={bingo.imageUrl}
            alt={bingo.title}
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-10 pt-28 sm:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light">
            <Ticket className="h-4 w-4" />
            Bingo Beneficente
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {bingo.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left: Event details */}
          <div className="lg:col-span-3">
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {bingo.description}
            </p>

            {/* Info cards */}
            <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              {bingo.date && (
                <div className="flex items-center gap-3 text-foreground">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
                    <CalendarDays className="h-5 w-5 text-royal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="font-medium capitalize">
                      {formatDate(bingo.date)}
                    </p>
                  </div>
                </div>
              )}

              {bingo.startTime && (
                <div className="flex items-center gap-3 text-foreground">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
                    <Clock className="h-5 w-5 text-royal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {bingo.startTime}
                      {bingo.endTime && ` — ${bingo.endTime}`}
                    </p>
                  </div>
                </div>
              )}

              {bingo.location && (
                <div className="flex items-center gap-3 text-foreground">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
                    <MapPin className="h-5 w-5 text-royal" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Local</p>
                    <p className="font-medium">{bingo.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Purchase card */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-sm font-medium text-gold-dark dark:text-gold-light">
                <Heart className="h-3.5 w-3.5" />
                Solidariedade
              </div>

              <h2 className="mb-1 text-xl font-bold text-foreground">
                Cartela de Bingo
              </h2>

              {bingo.price != null ? (
                <p className="mb-6 text-3xl font-bold text-gold-dark dark:text-gold-light">
                  {formatPrice(bingo.price)}
                </p>
              ) : (
                <p className="mb-6 text-lg text-muted-foreground">
                  Valor a ser definido
                </p>
              )}

              {/* Payment methods */}
              <div className="mb-6 space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-gold text-white shadow-md shadow-gold/20 hover:bg-gold-dark hover:shadow-gold/30"
                  disabled
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Pagar com Pix
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Cartão de Crédito
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                O pagamento online estará disponível em breve.
                <br />
                Toda a renda é revertida para as obras sociais da paróquia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
