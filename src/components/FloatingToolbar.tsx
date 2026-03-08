"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Home, CalendarDays, Shield, Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/calendario", icon: CalendarDays, label: "Calendário" },
  { href: "/admin", icon: Shield, label: "Admin" },
];

export function FloatingToolbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [themeBounce, setThemeBounce] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href)
  );

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
      });
    }
  }, [activeIndex]);

  const handleThemeToggle = () => {
    setThemeBounce(true);
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setThemeBounce(false), 400);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed top-4 right-4 z-50 sm:right-6 lg:right-8">
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-[22px] bg-gold/8 blur-xl dark:bg-gold/12" />

        <div
          className={cn(
            "relative flex items-center gap-0 rounded-[22px] p-1.5",
            "border border-white/[0.08] bg-[#1a1a2e]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl",
            "dark:bg-[#0d0d1a]/85 dark:border-white/[0.06] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
          )}
        >
          {/* Film grain noise overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[22px] opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Nav items container */}
          <div ref={navRef} className="relative flex items-center">
            {/* Sliding golden indicator */}
            {activeIndex >= 0 && (
              <div
                className="absolute top-0 h-full"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  transition: "left 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)",
                }}
              >
                {/* Layer 1: Glow */}
                <div className="absolute inset-[-4px] rounded-[22px] bg-[#e8af48]/15 blur-md" />

                {/* Layer 2: Clip container + Layer 3: Rotating conic gradient */}
                <div className="absolute inset-0 overflow-hidden rounded-[18px]">
                  <div
                    className="absolute inset-[-50%] h-[200%] w-[200%] animate-[spin-gold_4.5s_linear_infinite]"
                    style={{
                      backgroundImage: `conic-gradient(
                        from 0deg,
                        #533517 0%,
                        #c49746 8%,
                        #feeaa5 16%,
                        #c49746 24%,
                        #ffffff 25.5%,
                        #c49746 27%,
                        #ffc0cb 27.8%,
                        #93c5fd 29.3%,
                        #c49746 30.5%,
                        #533517 38%,
                        #feeaa5 46%,
                        #c49746 50%,
                        #533517 50%,
                        #c49746 58%,
                        #feeaa5 66%,
                        #c49746 74%,
                        #ffffff 75.5%,
                        #c49746 77%,
                        #ffc0cb 77.8%,
                        #93c5fd 79.3%,
                        #c49746 80.5%,
                        #533517 88%,
                        #feeaa5 96%,
                        #c49746 100%
                      )`,
                    }}
                  />
                </div>

                {/* Layer 4: Inner plate */}
                <div className="absolute inset-[2px] rounded-[16px] bg-[#1a1a2e] dark:bg-[#0d0d1a]" />
              </div>
            )}

            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <span key={item.href} className="flex items-center">
                  {index > 0 && (
                    <div className={cn(
                      "mx-0.5 h-5 w-px transition-opacity duration-300",
                      (isActive || index - 1 === activeIndex) ? "opacity-0" : "bg-white/10 opacity-100"
                    )} />
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        ref={(el) => { itemRefs.current[index] = el; }}
                        href={item.href}
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-[16px] transition-all duration-300",
                          isActive
                            ? "text-white"
                            : "text-white/40 hover:text-white/70"
                        )}
                      >
                        <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </span>
              );
            })}
          </div>

          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleThemeToggle}
                aria-label="Alternar tema"
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-[16px] text-white/40 transition-all duration-300 hover:text-white/70",
                  themeBounce && "animate-[theme-bounce_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
                )}
              >
                <Sun
                  className="absolute h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
                  strokeWidth={1.5}
                />
                <Moon
                  className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
                  strokeWidth={1.5}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              Alternar tema
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
