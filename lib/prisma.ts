import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

/** Runtime connection string for the pg driver (pooled Prisma Postgres URL). */
function getConnectionString() {
  const url = env.DATABASE_URL;
  if (!url) return url;

  // pg driver works reliably with sslmode=require for Prisma Postgres.
  if (url.includes("sslmode=verify-full")) {
    return url.replace("sslmode=verify-full", "sslmode=require");
  }

  if (url.includes("sslmode=require") && !url.includes("uselibpqcompat=")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}sslmode=require`;
}

function createPgPool() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 30_000,
    ssl: { rejectUnauthorized: true },
  });
}

function createPrismaClient() {
  const pool = globalForPrisma.pgPool ?? createPgPool();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
