"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Megaphone, Ticket, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/destaques", label: "Destaques", icon: Megaphone },
  { href: "/admin/bingo", label: "Bingo", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border/50 bg-card">
      <div className="border-b border-border/50 p-4">
        <h2 className="text-lg font-bold text-foreground">Painel Admin</h2>
        <p className="text-xs text-muted-foreground">
          Gerenciamento da paróquia
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-royal/10 text-royal"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
