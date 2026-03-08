import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/__tests__/**",
        "src/types/**",
        "src/components/ui/**",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/app/**/loading.tsx",
        "src/components/skeletons/**",
        "src/components/calendario/CalendarGrid.tsx",
        "src/components/HomeContent.tsx",
        "src/components/BannerShowcase.tsx",
        "src/components/admin/BannerForm.tsx",
        "src/components/admin/AdminBannerList.tsx",
        "src/components/admin/AdminMobileSidebar.tsx",
        "src/app/api/auth/[...nextauth]/**",
        "src/app/api/upload/**",
        "src/app/api/health/**",
        "src/lib/prisma.ts",
        "src/lib/auth.ts",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
