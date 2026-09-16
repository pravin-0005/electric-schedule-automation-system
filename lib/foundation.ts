export const phases = [
  { number: 1, title: "System foundation", description: "Next.js workspace, FastAPI health and contracts, PostgreSQL schema, Docker services, and n8n health workflow.", state: "Current" },
  { number: 2, title: "Projects & immutable uploads", description: "Authenticated projects, streaming PDF/XLSX validation, SHA-256 hashing, isolated storage, and audit events.", state: "Planned" },
  { number: 3, title: "Drawing extraction", description: "All-page PDF extraction, OCR fallback, normalized entities, and page-level evidence.", state: "Planned" },
  { number: 4, title: "Excel template profiling", description: "Dynamic sheets, headers, data regions, formulas, style fingerprints, and preservation warnings.", state: "Planned" },
  { number: 5, title: "Field mapping", description: "Configurable synonyms, domain rules, candidate mappings, and uncertainty detection.", state: "Planned" },
  { number: 6, title: "AI reasoning", description: "Provider-configurable structured suggestions validated against evidence and strict schemas.", state: "Planned" },
  { number: 7, title: "Engineer review", description: "Approve, reject, or override proposed cell changes with version checks and an immutable audit trail.", state: "Planned" },
  { number: 8, title: "Deterministic generation", description: "A new workbook from an approved snapshot, with safe formula translation and structure preservation.", state: "Planned" },
  { number: 9, title: "Validation & reports", description: "Source integrity, workbook fidelity, engineering consistency, and cell-level traceability.", state: "Planned" },
  { number: 10, title: "End-to-end acceptance", description: "Golden PDF-to-workbook test plus OCR, overflow rows, conflicts, overrides, and corruption fixtures.", state: "Planned" },
  { number: 11, title: "Production hardening", description: "Least-privilege service roles, quotas, backups, observability, deployment checks, and recovery drills.", state: "Planned" },
] as const

export type SystemStatus = {
  checkedAt: string
  database: "connected" | "unavailable" | "not_configured"
  schema: "ready" | "pending" | "unknown"
  version: string | null
  phase: 1
  processingEnabled: false
}
