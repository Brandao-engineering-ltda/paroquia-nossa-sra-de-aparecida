import { describe, it, expect, beforeEach } from "vitest";
import { useParishStore } from "@/store/useParishStore";

describe("useParishStore", () => {
  beforeEach(() => {
    useParishStore.setState({ isMobileMenuOpen: false });
  });

  it("has mass schedule for all 7 days", () => {
    const { massSchedule } = useParishStore.getState();
    expect(massSchedule).toHaveLength(7);
  });

  it("has Sunday with 4 mass times", () => {
    const { massSchedule } = useParishStore.getState();
    const sunday = massSchedule.find((s) => s.day === "Domingo");
    expect(sunday?.times).toHaveLength(4);
    expect(sunday?.times).toContain("07:00");
    expect(sunday?.times).toContain("19:00");
  });

  it("starts with mobile menu closed", () => {
    expect(useParishStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("toggles mobile menu", () => {
    useParishStore.getState().toggleMobileMenu();
    expect(useParishStore.getState().isMobileMenuOpen).toBe(true);
    useParishStore.getState().toggleMobileMenu();
    expect(useParishStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("closes mobile menu", () => {
    useParishStore.setState({ isMobileMenuOpen: true });
    useParishStore.getState().closeMobileMenu();
    expect(useParishStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("has weekday schedules with 2 times", () => {
    const { massSchedule } = useParishStore.getState();
    const monday = massSchedule.find((s) => s.day === "Segunda-feira");
    expect(monday?.times).toHaveLength(2);
    expect(monday?.times).toEqual(["07:00", "19:00"]);
  });

  it("has Saturday with unique times", () => {
    const { massSchedule } = useParishStore.getState();
    const saturday = massSchedule.find((s) => s.day === "Sábado");
    expect(saturday?.times).toEqual(["07:00", "17:00"]);
  });
});
