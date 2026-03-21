import { Metadata } from "next";
import { BingoContent } from "@/components/bingo/BingoContent";

export const metadata: Metadata = {
  title: "Bingo Beneficente | Paróquia Nossa Senhora Aparecida",
  description:
    "Participe do Bingo Beneficente da Paróquia Nossa Senhora Aparecida. Adquira sua cartela e concorra a prêmios incríveis!",
};

export default function BingoPage() {
  return <BingoContent />;
}
