"use client";

import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [
      "Pç. Nossa Senhora Aparecida, s/n",
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

        {/* Map + Contact info side by side */}
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Map — takes 3 columns */}
            <div className="relative lg:col-span-3">
              <iframe
                title="Localização da Paróquia Nossa Senhora Aparecida"
                src="https://www.google.com/maps?q=Praça+Nossa+Senhora+Aparecida,+s/n,+Vila+Esperança,+Maringá,+PR&output=embed"
                className="h-72 w-full lg:absolute lg:inset-0 lg:h-full"
                style={{ border: 0, minHeight: 320 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact details — takes 2 columns */}
            <div className="flex flex-col justify-center gap-6 p-8 lg:col-span-2">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-royal to-navy text-white">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {info.title}
                    </h3>
                    {info.lines.map((line) => (
                      <p
                        key={line}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <a
                href="https://www.google.com/maps/search/?api=1&query=Praça+Nossa+Senhora+Aparecida,+s/n,+Vila+Esperança,+Maringá,+PR"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 self-start rounded-lg bg-gradient-to-r from-royal to-navy px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-royal/25"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
