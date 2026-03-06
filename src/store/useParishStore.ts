import { create } from "zustand";

interface MassSchedule {
  day: string;
  times: string[];
}

interface ParishState {
  massSchedule: MassSchedule[];
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
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
