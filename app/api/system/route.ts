import { readSchemaVersion } from "@/lib/db"
import type { SystemStatus } from "@/lib/foundation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const database = await readSchemaVersion()
  const result: SystemStatus = { ...database, checkedAt: new Date().toISOString(), phase: 1, processingEnabled: false }
  return Response.json(result, { headers: { "Cache-Control": "no-store" } })
}
