import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@paroquia.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@paroquia.com",
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  console.log("Admin user created:", admin.email);

  const events = [
    {
      title: "Missa do Jubileu — 25 Anos",
      date: "2026-03-15",
      description:
        "Celebração especial pelos 25 anos da Paróquia Nossa Senhora Aparecida.",
      startTime: "10:00",
      endTime: "12:00",
      createdById: admin.id,
    },
    {
      title: "Encontro de Casais",
      date: "2026-03-22",
      description:
        "Um momento de reflexão e fortalecimento do sacramento do matrimônio.",
      startTime: "15:00",
      endTime: "18:00",
      createdById: admin.id,
    },
    {
      title: "Catequese — Início das Aulas",
      date: "2026-04-05",
      description:
        "Início do ano catequético para crianças e jovens da comunidade.",
      startTime: "09:00",
      endTime: "11:00",
      createdById: admin.id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log(`${events.length} events created.`);

  const banners = [
    {
      title: "Show de Louvor 2026",
      subtitle: "Uma noite especial de adoração",
      description:
        "Venha celebrar com a comunidade em uma noite de louvor, adoração e música. Traga sua família e amigos para este momento único de encontro com Deus.",
      date: "2026-04-18",
      startTime: "19:30",
      endTime: "22:00",
      location: "Paróquia Nossa Sra. Aparecida",
      ctaText: "Saiba Mais",
      ctaUrl: "#contato",
      gradient: "from-[#4a1942] via-navy to-royal",
      order: 0,
      createdById: admin.id,
    },
    {
      title: "Festa do Jubileu — 25 Anos",
      subtitle: "Celebração especial",
      description:
        "Celebramos 25 anos de fé e comunidade com uma programação especial: missa solene, almoço comunitário e apresentações culturais.",
      date: "2026-05-10",
      startTime: "09:00",
      endTime: "17:00",
      location: "Salão Paroquial",
      ctaText: "Participar",
      ctaUrl: "#contato",
      gradient: "from-gold-dark via-gold to-gold-light",
      order: 1,
      createdById: admin.id,
    },
    {
      title: "Retiro de Carnaval",
      subtitle: "Espiritualidade e reflexão",
      description:
        "Um final de semana de retiro espiritual para jovens e adultos. Palestras, dinâmicas e momentos de oração em um ambiente acolhedor.",
      date: "2026-06-20",
      startTime: "08:00",
      endTime: "18:00",
      location: "Chácara São José",
      gradient: "from-navy via-royal to-sky",
      order: 2,
      createdById: admin.id,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({ data: banner });
  }

  console.log(`${banners.length} banners created.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
