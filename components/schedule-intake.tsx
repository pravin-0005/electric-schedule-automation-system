"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, Check, FileSpreadsheet, FileText, Info, LoaderCircle, LockKeyhole, ShieldCheck, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WorkflowSteps } from "@/components/overview"
import { checkFile, validateFile, validateProjectName, type FileCheck, type FileKind } from "@/lib/intake"
import { cn } from "@/lib/utils"

function FileDrop({ kind, file, disabled, onChange }: { kind: FileKind; file: File | null; disabled: boolean; onChange: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const browse = useRef<HTMLButtonElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")
  const drawing = kind === "drawing"
  const Icon = drawing ? FileText : FileSpreadsheet

  function select(files: FileList | File[]) {
    setDragging(false)
    if (disabled || files.length === 0) return
    const issue = files.length !== 1 ? "Choose exactly one file for this field." : validateFile(files[0], kind)
    setError(issue ?? "")
    onChange(issue ? null : files[0])
  }

  return <Field data-invalid={!!error} data-disabled={disabled} className="min-w-0">
    <div className="mb-1 flex items-center justify-between gap-2">
      <FieldLabel htmlFor={`${kind}-file`}>{drawing ? "Engineering drawing" : "Excel schedule template"}</FieldLabel>
      <span className="text-[10px] text-muted-foreground">Required</span>
    </div>
    <div className={cn("upload-zone relative flex min-h-56 min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-5 text-center focus-within:ring-2 focus-within:ring-ring", dragging && !disabled && "is-dragging", file && "has-file")}
      onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); select(e.dataTransfer.files) }}>
      <input ref={input} id={`${kind}-file`} type="file" className="sr-only" disabled={disabled}
        accept={drawing ? ".pdf,application/pdf" : ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
        onChange={e => { if (e.target.files) select(e.target.files); e.target.value = "" }}
        aria-invalid={!!error} aria-describedby={`${kind}-hint${error ? ` ${kind}-error` : ""}`} />
      <span className={cn("feature-icon flex size-12 items-center justify-center rounded-xl", drawing ? "neutral" : "green")}><Icon className="size-6" strokeWidth={1.5} /></span>
      {file ? <>
        <p className="max-w-full truncate text-xs font-medium" title={file.name}>{file.name}</p>
        <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KiB · Selected on this device</p>
        <Button type="button" variant="outline" size="sm" disabled={disabled} aria-label={`Remove ${drawing ? "drawing" : "template"}`} onClick={() => { onChange(null); setError(""); requestAnimationFrame(() => browse.current?.focus()) }}><X data-icon="inline-start" />Remove file</Button>
      </> : <>
        <p className="text-xs font-medium">Drop your {drawing ? "drawing" : "template"} here</p>
        <Button ref={browse} type="button" variant="outline" size="sm" disabled={disabled} aria-label={`Browse ${drawing ? "drawing" : "template"} files`} onClick={() => input.current?.click()}><Upload data-icon="inline-start" />Browse files</Button>
      </>}
      <p id={`${kind}-hint`} className="text-[10px] text-muted-foreground">{drawing ? "PDF · Up to 50 MiB" : "XLSX · Up to 20 MiB"}</p>
    </div>
    {error && <p id={`${kind}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
    <FieldDescription>{drawing ? "The source of your equipment, cables, and connections." : "Your existing sheets, columns, formulas, and formatting."}</FieldDescription>
  </Field>
}

export function ScheduleIntake() {
  const [name, setName] = useState("")
  const [drawing, setDrawing] = useState<File | null>(null)
  const [template, setTemplate] = useState<File | null>(null)
  const [result, setResult] = useState<FileCheck[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const generation = useRef(0)
  const inFlight = useRef(false)
  useEffect(() => () => { generation.current += 1 }, [])

  function invalidate() {
    generation.current += 1
    setResult(null)
    setError("")
  }

  async function preflight(e: FormEvent) {
    e.preventDefault()
    if (inFlight.current) return
    const issue = validateProjectName(name)
    setNameError(issue)
    if (issue || !drawing || !template) return
    inFlight.current = true
    const current = ++generation.current
    setBusy(true); setError(""); setResult(null)
    try {
      const checked = await Promise.all([checkFile(drawing, "drawing"), checkFile(template, "template")])
      if (generation.current === current) setResult(checked)
    } catch (err) {
      if (generation.current === current) setError(err instanceof Error ? err.message : "The files could not be read. Please select them again.")
    } finally {
      inFlight.current = false
      if (generation.current === current) setBusy(false)
    }
  }

  return <div className="mx-auto flex max-w-5xl flex-col gap-7">
    <Link href="/" className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" />Back to overview</Link>
    <div><div className="eyebrow mb-2">A NEW CONNECTION</div><h1 className="page-title">Start with your source files.</h1><p className="mt-2 text-xs text-muted-foreground">Your engineering drawing supplies the data. Your template gives it a home.</p></div>
    <section className="rounded-xl border border-border bg-card p-5 md:p-6"><WorkflowSteps active /></section>
    <form onSubmit={preflight} aria-busy={busy} className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 md:p-7">
      <div className="flex flex-col gap-1"><h2 className="text-base font-semibold">Prepare a new schedule</h2><p className="text-xs text-muted-foreground">Check your files locally before the upload service is enabled.</p></div>
      <FieldGroup>
        <Field data-invalid={!!nameError} data-disabled={busy}>
          <FieldLabel htmlFor="project-name">Project name</FieldLabel>
          <Input id="project-name" value={name} disabled={busy} onChange={e => { setName(e.target.value); setNameError(null); invalidate() }} onBlur={() => { if (name) setNameError(validateProjectName(name)) }} placeholder="e.g. North substation — cable schedule" required maxLength={160} aria-invalid={!!nameError} aria-describedby={`project-name-hint${nameError ? " project-name-error" : ""}`} />
          <FieldDescription id="project-name-hint">A clear name makes it easier to find your schedule later.</FieldDescription>
          {nameError && <p id="project-name-error" role="alert" className="text-xs text-destructive">{nameError}</p>}
        </Field>
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          <FileDrop kind="drawing" file={drawing} disabled={busy} onChange={file => { setDrawing(file); invalidate() }} />
          <FileDrop kind="template" file={template} disabled={busy} onChange={file => { setTemplate(file); invalidate() }} />
        </div>
      </FieldGroup>
      <Alert><LockKeyhole /><AlertTitle>Local checks only</AlertTitle><AlertDescription>Files stay on your device. Nothing is uploaded, saved, or modified. A matching signature and fingerprint do not prove that a PDF or workbook is structurally valid or safe.</AlertDescription></Alert>
      {error && <Alert variant="destructive"><Info /><AlertTitle>File check needs attention</AlertTitle><AlertDescription className="break-all">{error}</AlertDescription></Alert>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <p className="text-[11px] text-muted-foreground">Step 1 · Prepare your files</p>
        <Button type="submit" size="lg" disabled={busy || !drawing || !template || !name.trim()}>{busy ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <ShieldCheck data-icon="inline-start" />}{busy ? "Checking files…" : "Check files locally"}</Button>
      </div>
      <p role="status" className="sr-only">{busy ? "Checking file signatures and SHA-256 fingerprints." : result ? "Local checks complete. Nothing has been uploaded." : ""}</p>
    </form>
    {result && <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5 md:p-7" aria-label="Local check results">
      <div className="flex items-center gap-2"><Check className="size-5 text-success" /><h2 className="text-base font-semibold">Local checks complete</h2></div>
      <p className="text-xs text-muted-foreground">Preliminary signatures matched for <span className="break-all font-medium">{name.trim()}</span>. These are file fingerprints, not a full integrity validation.</p>
      {result.map((file, index) => <div key={index} className="min-w-0 rounded-lg bg-muted/50 p-3"><p className="break-all text-xs font-medium">{file.name}</p><p className="mt-1 text-[10px] text-muted-foreground">SHA-256</p><code className="mt-1 block break-all text-[10px] text-muted-foreground">{file.sha256}</code></div>)}
      <Alert><Info /><AlertTitle>Upload is not enabled yet</AlertTitle><AlertDescription>Phase 2 adds authenticated projects, immutable uploads, and server-side validation. Your files have not left this device.</AlertDescription></Alert>
      <Button disabled className="self-start">Continue to upload<ArrowRight data-icon="inline-end" /></Button>
    </section>}
  </div>
}
