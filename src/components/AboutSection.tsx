"use client";

import { Heart, Users, BookOpen, Church } from "lucide-react";

const features = [
  {
    icon: Church,
    title: "25 Anos de Fé",
    description:
      "Desde 2001, somos um ponto de encontro para a comunidade católica de Maringá, celebrando a fé e os sacramentos.",
  },
  {
    icon: Users,
    title: "Comunidade Viva",
    description:
      "Uma paróquia acolhedora, com pastorais e movimentos que promovem o encontro e a fraternidade entre todos.",
  },
  {
    icon: BookOpen,
    title: "Catequese e Formação",
    description:
      "Oferecemos formação cristã para todas as idades, da catequese infantil aos grupos de estudo bíblico.",
  },
  {
    icon: Heart,
    title: "Ação Social",
    description:
      "Comprometidos com a caridade e a justiça social, levando o amor de Cristo aos mais necessitados.",
  },
];

export function AboutSection() {
  return (
    <section id="sobre" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-dark">
            <Heart className="h-4 w-4" />
            Nossa História
          </div>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Sobre a Paróquia
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Há 25 anos, a Paróquia Nossa Senhora Aparecida é um farol de fé e
            esperança na cidade de Maringá, Paraná. Sob a proteção de Nossa
            Senhora, caminhamos juntos na fé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center rounded-2xl border border-border/50 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-royal to-navy text-white transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-navy">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
