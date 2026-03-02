import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo & description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4 overflow-hidden rounded-[10px] border border-white/15 bg-white/10 p-2 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              <Image
                src="/images/logo-nsa.png"
                alt="Paróquia Nossa Senhora Aparecida"
                width={80}
                height={80}
                className="h-18 w-auto rounded-[10px]"
              />
            </div>
            <p className="text-center text-sm text-light-blue/80 md:text-left">
              Paróquia Nossa Senhora Aparecida — Celebrando 25 anos de fé e
              comunidade em Maringá, PR.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Links Rápidos
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "#inicio", label: "Início" },
                { href: "#horarios", label: "Horários das Missas" },
                { href: "#sobre", label: "Sobre a Paróquia" },
                { href: "#eventos", label: "Eventos" },
                { href: "#contato", label: "Contato" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-light-blue/70 transition-colors hover:text-gold-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Parish Info */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Paróquia
            </h3>
            <p className="text-sm text-light-blue/70">
              Arquidiocese de Maringá
            </p>
            <p className="mt-1 text-sm text-light-blue/70">
              Maringá — Paraná, Brasil
            </p>
            <p className="mt-4 text-sm text-light-blue/70">
              &quot;Maria, Mãe de Deus, rogai por nós.&quot;
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <p className="text-center text-xs text-light-blue/50">
          &copy; {new Date().getFullYear()} Paróquia Nossa Senhora Aparecida —
          Maringá, PR. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
