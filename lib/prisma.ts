import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Avoid pg driver SSL deprecation warning for `sslmode=require`. */
function getConnectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (url.includes("sslmode=require") && !url.includes("uselibpqcompat=")) {
    return url.replace("sslmode=require", "sslmode=verify-full");
  }
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getConnectionString(),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
