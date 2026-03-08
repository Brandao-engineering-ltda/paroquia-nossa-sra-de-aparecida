"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParishStore } from "@/store/useParishStore";

export function MassScheduleSection() {
  const { massSchedule } = useParishStore();

  return (
    <section id="horarios" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal">
            <Clock className="h-4 w-4" />
            Programação
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Horários das Missas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Confira os horários das celebrações eucarísticas da nossa paróquia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {massSchedule.map((schedule) => (
            <Card
              key={schedule.day}
              className="group border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground group-hover:text-royal">
                  {schedule.day}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {schedule.times.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
