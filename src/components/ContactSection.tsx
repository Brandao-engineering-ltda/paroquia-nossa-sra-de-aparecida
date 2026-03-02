"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: ["Rua Exemplo, 123", "Jd. Alvorada — Maringá, PR", "CEP: 87000-000"],
  },
  {
    icon: Phone,
    title: "Telefone",
    lines: ["(44) 3000-0000", "(44) 99999-0000"],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: ["contato@nsaparecida.org.br"],
  },
  {
    icon: Clock,
    title: "Secretaria",
    lines: ["Seg a Sex: 08:00 — 17:00", "Sábado: 08:00 — 12:00"],
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            <MapPin className="h-4 w-4" />
            Localização
          </div>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Entre em Contato
          </h2>
          <p className="mt-3 text-muted-foreground">
            Estamos de portas abertas para receber você. Venha nos visitar!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info) => (
            <Card
              key={info.title}
              className="border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-royal to-navy text-white">
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-navy">{info.title}</h3>
                {info.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-muted-foreground"
                  >
                    {line}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
