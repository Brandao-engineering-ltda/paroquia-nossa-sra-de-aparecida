import { prisma } from "@/lib/prisma";
import { AdminBannerList } from "@/components/admin/AdminBannerList";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
    include: {
      createdBy: {
        select: { name: true },
      },
    },
  });

  return <AdminBannerList initialBanners={banners} />;
}
