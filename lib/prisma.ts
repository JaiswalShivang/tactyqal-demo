import { PrismaClient } from "@prisma/client";

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function getSafePostgresUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (url && (url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url
      .replace(/-pooler\./g, ".")
      .replace(/&channel_binding=require/g, "")
      .replace(/\?channel_binding=require&?/g, "?")
      .replace(/\?$/g, "");
  }
  return "postgresql://postgres:postgres@localhost:5432/tactyqal?schema=public";
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: getSafePostgresUrl(),
      },
    },
    log: [],
  });
}

const prisma =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (global.__prismaClient ?? (global.__prismaClient = createPrismaClient()));

export default prisma;

