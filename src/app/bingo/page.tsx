import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BingoPurchasePage } from "@/components/bingo/BingoPurchasePage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comprar Cartela — Bingo Beneficente | Paróquia Nossa Senhora Aparecida",
  description:
    "Adquira sua cartela do Bingo Beneficente da Paróquia Nossa Senhora Aparecida. Pagamento via Pix ou Cartão de Crédito.",
};

export default async function BingoPage() {
  const bingo = await prisma.bingoEvent.findFirst({
    where: { isActive: true },
  });

  if (!bingo) notFound();

  return (
    <BingoPurchasePage
      bingo={{
        id: bingo.id,
        title: bingo.title,
        description: bingo.description,
        date: bingo.date,
        startTime: bingo.startTime,
        endTime: bingo.endTime,
        location: bingo.location,
        imageUrl: bingo.imageUrl,
        price: bingo.price,
      }}
    />
  );
}
