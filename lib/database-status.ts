import contract from "../contracts/foundation.json"
import type { SystemStatus } from "./foundation"

type DatabaseStatus = Pick<SystemStatus, "database" | "schema" | "version">
type Query = (text: string, values?: string[]) => Promise<{ rows: { version: string }[] }>

export async function inspectDatabase(query: Query | null): Promise<DatabaseStatus> {
  if (!query) return { database: "not_configured", schema: "unknown", version: null }
  try {
    await query("SELECT 1")
  } catch {
    return { database: "unavailable", schema: "unknown", version: null }
  }
  try {
    const { rows } = await query("SELECT version FROM public.es_schema_migrations WHERE version = $1", [contract.migrationVersion])
    const version = rows[0]?.version ?? null
    return { database: "connected", schema: version ? "ready" : "pending", version }
  } catch (error) {
    const missingTable = typeof error === "object" && error !== null && "code" in error && error.code === "42P01"
    return { database: "connected", schema: missingTable ? "pending" : "unknown", version: null }
  }
}
