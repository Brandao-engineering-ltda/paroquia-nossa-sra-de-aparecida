import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { MassScheduleSkeleton } from "@/components/skeletons/MassScheduleSkeleton";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";
import { EventsSkeleton } from "@/components/skeletons/EventsSkeleton";
import { ContactSkeleton } from "@/components/skeletons/ContactSkeleton";
import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";
import { CalendarSkeleton } from "@/components/skeletons/CalendarSkeleton";
import { AdminDashboardSkeleton } from "@/components/skeletons/AdminDashboardSkeleton";

describe("Skeleton components", () => {
  it("renders HeroSkeleton without crashing", () => {
    const { container } = render(<HeroSkeleton />);
    expect(container.querySelector("[data-slot='skeleton']")).toBeInTheDocument();
  });

  it("renders MassScheduleSkeleton with 7 card placeholders", () => {
    const { container } = render(<MassScheduleSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders AboutSkeleton with 4 feature placeholders", () => {
    const { container } = render(<AboutSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders EventsSkeleton with 3 event card placeholders", () => {
    const { container } = render(<EventsSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders ContactSkeleton with 4 contact card placeholders", () => {
    const { container } = render(<ContactSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders HeaderSkeleton without crashing", () => {
    const { container } = render(<HeaderSkeleton />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("renders CalendarSkeleton without crashing", () => {
    const { container } = render(<CalendarSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders AdminDashboardSkeleton with 3 stat card placeholders", () => {
    const { container } = render(<AdminDashboardSkeleton />);
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
