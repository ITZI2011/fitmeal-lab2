// web/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // pour éviter plusieurs instances en dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
