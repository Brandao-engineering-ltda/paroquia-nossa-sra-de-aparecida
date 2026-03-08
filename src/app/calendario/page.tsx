import { CalendarGrid } from "@/components/calendario/CalendarGrid";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="relative min-h-screen bg-secondary">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-royal/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full bg-sky/5 blur-3xl" />
      </div>

      <FloatingToolbar />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 pt-16 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal backdrop-blur-sm">
            <CalendarDays className="h-4 w-4" />
            Calendário
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Calendário da Paróquia
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Gerencie os eventos e atividades da comunidade.
          </p>
        </div>
        <CalendarGrid />
      </div>
    </div>
  );
}
