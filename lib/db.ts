import "server-only"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

const migrations = pgTable("es_schema_migrations", {
  version: text("version").primaryKey(),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull(),
})

const globalForDb = globalThis as unknown as { schedulePool?: Pool }

export async function readSchemaVersion() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return { database: "not_configured", schema: "unknown", version: null } as const
  const pool = globalForDb.schedulePool ?? new Pool({ connectionString, max: 2, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, query_timeout: 5000 })
  globalForDb.schedulePool = pool
  const db = drizzle(pool)
  try {
    const rows = await db.select({ version: migrations.version }).from(migrations).limit(20)
    const version = rows.find(row => row.version === "001_foundation")?.version ?? null
    return { database: "connected", schema: version ? "ready" : "pending", version } as const
  } catch {
    return { database: "unavailable", schema: "unknown", version: null } as const
  }
}
