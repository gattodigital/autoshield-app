import { PrismaClient } from '@prisma/client'
import { loadEnvConfig } from '@next/env'

// Ensure server-side env vars are loaded even during dev reload edge cases.
loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
