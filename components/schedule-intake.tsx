"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, FileSpreadsheet, FileText, Info, LoaderCircle, LockKeyhole, ShieldCheck, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WorkflowSteps } from "@/components/overview"
import { cn } from "@/lib/utils"

type FileCheck = { name: string; size: number; sha256: string }
type Kind = "drawing" | "template"
const limits = { drawing: 50 * 1024 * 1024, template: 20 * 1024 * 1024 }

function FileDrop({ kind, file, onChange }: { kind: Kind; file: File | null; onChange: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")
  const drawing = kind === "drawing"
  const Icon = drawing ? FileText : FileSpreadsheet
  function select(candidate?: File) {
    setDragging(false)
    if (!candidate) return
    const extension = drawing ? ".pdf" : ".xlsx"
    if (!candidate.name.toLowerCase().endsWith(extension)) { setError(`Choose a ${extension} file. Other formats are not supported yet.`); return }
    if (candidate.size === 0 || candidate.size > limits[kind]) { setError(`Choose a non-empty file smaller than ${drawing ? 50 : 20} MB.`); return }
    setError(""); onChange(candidate)
  }
  return <Field data-invalid={!!error}><div className="mb-1 flex items-center justify-between"><FieldLabel htmlFor={`${kind}-file`}>{drawing ? "Engineering drawing" : "Excel schedule template"}</FieldLabel><span className="text-[10px] text-muted-foreground">Required</span></div><div className={cn("upload-zone relative flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-5 text-center", dragging && "is-dragging", file && "has-file")} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); select(e.dataTransfer.files[0]) }}><input ref={input} id={`${kind}-file`} type="file" className="sr-only" accept={drawing ? ".pdf,application/pdf" : ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} onChange={e => { select(e.target.files?.[0]); e.target.value = "" }} aria-invalid={!!error} aria-describedby={`${kind}-hint`} /><span className={cn("feature-icon flex size-12 items-center justify-center rounded-xl", drawing ? "neutral" : "green")}><Icon className="size-6" strokeWidth={1.5} /></span>{file ? <><p className="max-w-full truncate text-xs font-medium">{file.name}</p><p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Selected on this device</p><Button variant="outline" size="sm" onClick={() => { onChange(null); setError("") }}><X data-icon="inline-start" />Remove file</Button></> : <><p className="text-xs font-medium">Drop your {drawing ? "drawing" : "template"} here</p><Button variant="outline" size="sm" onClick={() => input.current?.click()}><Upload data-icon="inline-start" />Browse files</Button><p id={`${kind}-hint`} className="text-[10px] text-muted-foreground">{drawing ? "PDF · Up to 50 MB" : "XLSX · Up to 20 MB"}</p></>}</div>{error && <p role="alert" className="text-xs text-destructive">{error}</p>}<FieldDescription>{drawing ? "The source of your equipment, cables, and connections." : "Your sheets, formatting, formulas, and schedule structure."}</FieldDescription></Field>
}

async function checkFile(file: File, kind: Kind): Promise<FileCheck> {
  const buffer = await file.arrayBuffer()
  const signature = new Uint8Array(buffer.slice(0, 5))
  const valid = kind === "drawing" ? new TextDecoder().decode(signature) === "%PDF-" : signature[0] === 0x50 && signature[1] === 0x4b && signature[2] === 0x03 && signature[3] === 0x04
  if (!valid) throw new Error(`${file.name} does not have the expected ${kind === "drawing" ? "PDF" : "ZIP-based XLSX"} signature.`)
  const hash = await crypto.subtle.digest("SHA-256", buffer)
  return { name: file.name, size: file.size, sha256: Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("") }
}

export function ScheduleIntake() {
  const [name, setName] = useState("")
  const [drawing, setDrawing] = useState<File | null>(null)
  const [template, setTemplate] = useState<File | null>(null)
  const [result, setResult] = useState<FileCheck[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  async function preflight(e: React.FormEvent) {
    e.preventDefault()
    if (!drawing || !template || !name.trim()) return
    setBusy(true); setError(""); setResult(null)
    try { setResult(await Promise.all([checkFile(drawing, "drawing"), checkFile(template, "template")])) }
    catch (err) { setError(err instanceof Error ? err.message : "The files could not be read. Please select them again.") }
    finally { setBusy(false) }
  }
  return <div className="mx-auto flex max-w-5xl flex-col gap-7"><Link href="/" className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" />Back to overview</Link><div><div className="eyebrow mb-2">A NEW CONNECTION</div><h1 className="page-title">Start with your source files.</h1><p className="mt-2 text-xs text-muted-foreground">Your engineering drawing supplies the data. Your template gives it a home.</p></div><section className="rounded-xl border border-border bg-card p-5 md:p-6"><WorkflowSteps active /></section><form onSubmit={preflight} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 md:p-7"><div className="flex flex-col gap-1"><h2 className="text-base font-semibold">Prepare a new schedule</h2><p className="text-xs text-muted-foreground">Check your files locally before the upload service is enabled.</p></div><FieldGroup><Field><FieldLabel htmlFor="project-name">Project name</FieldLabel><Input id="project-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North substation — cable schedule" required maxLength={160} /><FieldDescription>A clear name makes it easier to find your schedule later.</FieldDescription></Field><div className="grid gap-5 md:grid-cols-2"><FileDrop kind="drawing" file={drawing} onChange={file => { setDrawing(file); setResult(null); setError("") }} /><FileDrop kind="template" file={template} onChange={file => { setTemplate(file); setResult(null); setError("") }} /></div></FieldGroup><div className="flex items-start gap-2 rounded-lg bg-muted/65 p-3 text-[11px] leading-relaxed text-muted-foreground"><LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-success" /><p>Files stay on your device during this check. Nothing is uploaded, saved, or modified. Full file integrity validation will run on the server in Phase 2.</p></div>{error && <Alert variant="destructive"><Info /><AlertTitle>File check needs attention</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}{result && <Alert><ShieldCheck /><AlertTitle>File signatures and fingerprints checked</AlertTitle><AlertDescription><p>Both files passed the basic local check. This does not validate PDF contents or workbook structure.</p>{result.map(file => <div key={file.sha256} className="mt-2 flex max-w-full flex-col gap-1"><span className="truncate font-medium">{file.name}</span><code className="break-all text-[10px]">SHA-256: {file.sha256}</code></div>)}<p className="mt-3">Nothing has been saved. Project creation and file transfer are the next implementation phase.</p></AlertDescription></Alert>}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><p className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Info className="size-3.5" />Phase 1 · Local file preparation</p><Button type="submit" size="lg" disabled={!drawing || !template || !name.trim() || busy}>{busy ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : result ? <Check data-icon="inline-start" /> : <ShieldCheck data-icon="inline-start" />}{busy ? "Checking files…" : result ? "Check files again" : "Check source files"}{!busy && <ArrowRight data-icon="inline-end" />}</Button></div></form><p className="text-center text-[11px] text-muted-foreground">Analysis and generation are not enabled yet. <Link href="/guide#roadmap" className="font-medium text-foreground underline underline-offset-4">See the implementation roadmap</Link></p></div>
}
