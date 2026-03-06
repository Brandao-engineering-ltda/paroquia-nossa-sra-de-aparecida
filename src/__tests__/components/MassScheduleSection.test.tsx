import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MassScheduleSection } from "@/components/MassScheduleSection";

describe("MassScheduleSection", () => {
  it("renders the section heading", () => {
    render(<MassScheduleSection />);
    expect(screen.getByText("Horários das Missas")).toBeInTheDocument();
  });

  it("renders all days of the week", () => {
    render(<MassScheduleSection />);
    expect(screen.getByText("Domingo")).toBeInTheDocument();
    expect(screen.getByText("Segunda-feira")).toBeInTheDocument();
    expect(screen.getByText("Terça-feira")).toBeInTheDocument();
    expect(screen.getByText("Quarta-feira")).toBeInTheDocument();
    expect(screen.getByText("Quinta-feira")).toBeInTheDocument();
    expect(screen.getByText("Sexta-feira")).toBeInTheDocument();
    expect(screen.getByText("Sábado")).toBeInTheDocument();
  });

  it("renders mass times", () => {
    render(<MassScheduleSection />);
    const times07 = screen.getAllByText("07:00");
    expect(times07.length).toBeGreaterThanOrEqual(7);
  });

  it("has correct section id", () => {
    const { container } = render(<MassScheduleSection />);
    expect(container.querySelector("#horarios")).toBeInTheDocument();
  });

  it("renders badge text", () => {
    render(<MassScheduleSection />);
    expect(screen.getByText("Programação")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<MassScheduleSection />);
    expect(
      screen.getByText(/Confira os horários das celebrações/)
    ).toBeInTheDocument();
  });
});
