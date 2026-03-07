import { NextResponse } from "next/server";
import { PrismaLibSql } from "@prisma/adapter-libsql";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
    DATABASE_AUTH_TOKEN_set: !!process.env.DATABASE_AUTH_TOKEN,
    DATABASE_AUTH_TOKEN_length: process.env.DATABASE_AUTH_TOKEN?.length ?? 0,
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./dev.db",
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    const { PrismaClient } = await import("@prisma/client");
    const testClient = new PrismaClient({ adapter });

    const users = await testClient.user.count();
    const events = await testClient.event.count();

    diagnostics.db_connected = true;
    diagnostics.user_count = users;
    diagnostics.event_count = events;

    await testClient.$disconnect();
  } catch (error: unknown) {
    diagnostics.db_connected = false;
    diagnostics.error_name = error instanceof Error ? error.name : "Unknown";
    diagnostics.error_message = error instanceof Error ? error.message : String(error);
    if (error && typeof error === "object" && "cause" in error) {
      diagnostics.error_cause = String((error as { cause: unknown }).cause);
    }
  }

  return NextResponse.json(diagnostics, { status: diagnostics.db_connected ? 200 : 500 });
}
