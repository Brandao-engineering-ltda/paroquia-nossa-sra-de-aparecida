"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Plus, Eye, EyeOff, GripVertical } from "lucide-react";
import { BannerForm } from "./BannerForm";

interface BannerData {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  imageUrl: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  gradient: string;
  isActive: boolean;
  order: number;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AdminBannerList({
  initialBanners,
}: {
  initialBanners: BannerData[];
}) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    }
    setLoadingId(null);
  }

  async function handleToggleActive(banner: BannerData) {
    setLoadingId(banner.id);
    const res = await fetch(`/api/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    if (res.ok) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? { ...b, isActive: !b.isActive } : b
        )
      );
      router.refresh();
    }
    setLoadingId(null);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingBanner(null);
    router.refresh();
    // Reload banners
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => setBanners(data));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Destaques</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os banners exibidos na página inicial.
        </p>
        <Button
          className="mt-4 bg-gold text-white hover:bg-gold-dark"
          onClick={() => {
            setEditingBanner(null);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Destaque
        </Button>
      </div>

      <div className="space-y-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
          >
            <GripVertical className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />

            {/* Preview swatch */}
            <div
              className={`hidden h-14 w-20 shrink-0 rounded-lg bg-gradient-to-r sm:block ${banner.gradient}`}
            />

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-foreground">
                  {banner.title}
                </h3>
                <Badge
                  variant={banner.isActive ? "default" : "secondary"}
                  className={
                    banner.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {banner.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {banner.description}
              </p>
              {banner.date && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(banner.date)}
                  {banner.location && ` — ${banner.location}`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingId === banner.id}
                onClick={() => handleToggleActive(banner)}
                title={banner.isActive ? "Desativar" : "Ativar"}
              >
                {banner.isActive ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-green-600" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingBanner(banner);
                  setShowForm(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingId === banner.id}
                onClick={() => handleDelete(banner.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/50 p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum destaque criado ainda.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setEditingBanner(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro destaque
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => {
            setShowForm(false);
            setEditingBanner(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
