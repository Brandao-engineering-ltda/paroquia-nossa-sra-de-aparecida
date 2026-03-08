"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [
      "Praça Nossa Senhora Aparecida, s/n",
      "Vila Esperança — Maringá, PR",
      "CEP: 87020-790",
    ],
  },
  {
    icon: Phone,
    title: "Telefone",
    lines: ["(44) 3267-0484", "(44) 98423-0760 (WhatsApp)"],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: ["secretaria@paroquiaaparecidamga.com.br"],
  },
  {
    icon: Clock,
    title: "Secretaria",
    lines: [
      "Seg a Sex: 08:00 — 12:00 / 13:00 — 17:00",
      "Sábado: 08:00 — 12:00",
    ],
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            <MapPin className="h-4 w-4" />
            Localização
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
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
                <h3 className="mb-2 font-semibold text-foreground">{info.title}</h3>
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

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <iframe
            title="Localização da Paróquia Nossa Senhora Aparecida"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.5!2d-51.9386!3d-23.4206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd70e49c1c1c1%3A0x2e0e0e0e0e0e0e0e!2sPar%C3%B3quia%20Nossa%20Senhora%20Aparecida%20-%20Vila%20Esperan%C3%A7a%2C%20Maring%C3%A1%20-%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
