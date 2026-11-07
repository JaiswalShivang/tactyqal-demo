import { PrismaClient } from "@prisma/client";

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : (global.__prismaClient ?? (global.__prismaClient = createPrismaClient()));

export default prisma;

