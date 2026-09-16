import "server-only"
import { Pool } from "pg"
import { inspectDatabase } from "./database-status"

const globalForDb = globalThis as unknown as { schedulePool?: Pool }

export async function readSchemaVersion() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return inspectDatabase(null)
  const pool = globalForDb.schedulePool ?? new Pool({ connectionString, max: 2, connectionTimeoutMillis: 3000, idleTimeoutMillis: 10000, query_timeout: 3000, statement_timeout: 3000 })
  globalForDb.schedulePool = pool
  return inspectDatabase((text, values) => pool.query(text, values))
}
