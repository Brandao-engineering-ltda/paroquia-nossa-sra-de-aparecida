"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENT_OPTIONS = [
  { value: "none", label: "Sem gradiente" },
  { value: "from-royal via-navy to-royal", label: "Azul Royal" },
  { value: "from-navy via-royal to-sky", label: "Oceano" },
  { value: "from-gold-dark via-gold to-gold-light", label: "Dourado" },
  { value: "from-navy via-[#1e3a5f] to-royal", label: "Noturno" },
  { value: "from-royal via-sky to-royal", label: "Celeste" },
  { value: "from-[#4a1942] via-navy to-royal", label: "Ametista" },
  { value: "from-royal/60 via-navy/60 to-royal/60", label: "Azul Suave" },
  { value: "from-navy/50 via-royal/50 to-sky/50", label: "Oceano Suave" },
  { value: "from-gold-dark/50 via-gold/50 to-gold-light/50", label: "Dourado Suave" },
  { value: "from-[#4a1942]/50 via-navy/50 to-royal/50", label: "Ametista Suave" },
  { value: "from-black/40 via-black/20 to-black/40", label: "Escuro Transparente" },
];

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
}

interface BannerFormProps {
  banner: BannerData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BannerForm({ banner, onClose, onSuccess }: BannerFormProps) {
  const isEditing = !!banner;
  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [description, setDescription] = useState(banner?.description || "");
  const [date, setDate] = useState(banner?.date || "");
  const [startTime, setStartTime] = useState(banner?.startTime || "");
  const [endTime, setEndTime] = useState(banner?.endTime || "");
  const [location, setLocation] = useState(banner?.location || "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || "");
  const [ctaText, setCtaText] = useState(banner?.ctaText || "");
  const [ctaUrl, setCtaUrl] = useState(banner?.ctaUrl || "");
  const [gradient, setGradient] = useState(banner?.gradient || GRADIENT_OPTIONS[0].value);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setImageUrl(data.url);
    } else {
      setError(data.error || "Erro ao enviar imagem.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = { title, subtitle, description, date, startTime, endTime, location, imageUrl, ctaText, ctaUrl, gradient };
    const url = isEditing ? `/api/banners/${banner.id}` : "/api/banners";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao salvar destaque.");
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Destaque" : "Novo Destaque"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-title">Título</Label>
            <Input
              id="banner-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Show de Louvor 2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-subtitle">Subtítulo (opcional)</Label>
            <Input
              id="banner-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Uma noite especial de adoração"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner-description">Descrição</Label>
            <Textarea
              id="banner-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o evento em destaque"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banner-date">Data</Label>
              <Input
                id="banner-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-location">Local</Label>
              <Input
                id="banner-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Local do evento"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banner-startTime">Início</Label>
              <Input
                id="banner-startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-endTime">Término</Label>
              <Input
                id="banner-endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem (opcional)</Label>
            {imageUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={96}
                  height={64}
                  className="h-16 w-24 rounded object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {imageUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImageUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-royal/50 hover:text-foreground"
              >
                <Upload className="h-5 w-5" />
                {uploading ? "Enviando..." : "Clique para selecionar uma imagem"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="banner-ctaText">Texto do botão</Label>
              <Input
                id="banner-ctaText"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Ex: Saiba Mais"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-ctaUrl">Link do botão</Label>
              <Input
                id="banner-ctaUrl"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gradiente de fundo</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGradient(opt.value)}
                  className={cn(
                    "h-10 rounded-lg border-2 transition-all",
                    opt.value === "none"
                      ? "bg-card text-xs text-muted-foreground"
                      : `bg-gradient-to-r ${opt.value}`,
                    gradient === opt.value
                      ? "border-gold ring-2 ring-gold/30"
                      : "border-transparent hover:border-foreground/20"
                  )}
                  title={opt.label}
                >
                  {opt.value === "none" && "Nenhum"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gold text-white hover:bg-gold-dark"
              disabled={loading}
            >
              {loading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
