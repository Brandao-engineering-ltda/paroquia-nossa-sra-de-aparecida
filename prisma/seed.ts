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
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
