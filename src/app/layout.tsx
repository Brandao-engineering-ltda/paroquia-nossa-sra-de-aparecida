import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paróquia Nossa Senhora Aparecida — Maringá, PR",
  description:
    "Paróquia Nossa Senhora Aparecida — Jubileu 25 Anos. Celebrando fé, comunidade e amor em Maringá, Paraná.",
  keywords: [
    "paróquia",
    "nossa senhora aparecida",
    "maringá",
    "igreja católica",
    "missa",
    "jubileu 25 anos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
