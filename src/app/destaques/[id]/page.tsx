import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DestaqueDetail } from "./DestaqueDetail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) return {};
  return {
    title: banner.title,
    description: banner.description,
  };
}

export default async function DestaquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const banner = await prisma.banner.findUnique({ where: { id } });

  if (!banner) notFound();

  return <DestaqueDetail banner={banner} />;
}
