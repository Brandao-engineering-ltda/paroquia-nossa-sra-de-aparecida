import { CalendarGrid } from "@/components/calendario/CalendarGrid";
import { LogoutButton } from "@/components/calendario/LogoutButton";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-ice">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal">
              <CalendarDays className="h-4 w-4" />
              Calendário
            </div>
            <h1 className="text-3xl font-bold text-navy">
              Calendário da Paróquia
            </h1>
            <p className="mt-2 text-muted-foreground">
              Gerencie os eventos e atividades da comunidade.
            </p>
          </div>
          <LogoutButton />
        </div>
        <CalendarGrid />
      </div>
    </div>
  );
}
