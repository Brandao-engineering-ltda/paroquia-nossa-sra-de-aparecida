import { create } from "zustand";

interface MassSchedule {
  day: string;
  times: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface ParishState {
  massSchedule: MassSchedule[];
  events: Event[];
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useParishStore = create<ParishState>((set) => ({
  massSchedule: [
    { day: "Domingo", times: ["07:00", "09:00", "11:00", "19:00"] },
    { day: "Segunda-feira", times: ["07:00", "19:00"] },
    { day: "Terça-feira", times: ["07:00", "19:00"] },
    { day: "Quarta-feira", times: ["07:00", "19:00"] },
    { day: "Quinta-feira", times: ["07:00", "19:00"] },
    { day: "Sexta-feira", times: ["07:00", "19:00"] },
    { day: "Sábado", times: ["07:00", "17:00"] },
  ],
  events: [
    {
      id: "1",
      title: "Missa do Jubileu — 25 Anos",
      date: "2026-03-15",
      description:
        "Celebração especial pelos 25 anos da Paróquia Nossa Senhora Aparecida.",
    },
    {
      id: "2",
      title: "Encontro de Casais",
      date: "2026-03-22",
      description:
        "Um momento de reflexão e fortalecimento do sacramento do matrimônio.",
    },
    {
      id: "3",
      title: "Catequese — Início das Aulas",
      date: "2026-04-05",
      description:
        "Início do ano catequético para crianças e jovens da comunidade.",
    },
  ],
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
