"use client"

import Link from "next/link"
import { ArrowDownToLine, ArrowRight, Check, CheckCheck, FileCheck2, FileInput, FileSpreadsheet, FileText, FolderOpen, GitBranch, Plus, ScanLine, ShieldCheck, Sparkles, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function PipelineIllustration() {
  return <div className="pipeline-illustration" aria-label="Drawing PDF and Excel template combine into a new electrical schedule">
    <div className="diagram-source drawing-source"><div className="diagram-document"><div className="flex items-center justify-between"><FileText className="size-4 text-muted-foreground" /><span className="font-mono text-[8px] text-muted-foreground">.PDF</span></div><div className="circuit-preview" aria-hidden="true"><div /><div /><div /><span /><span /></div><div className="mt-2 h-1 w-16 rounded-full bg-border" /><div className="mt-1 h-1 w-10 rounded-full bg-border" /></div><span>Engineering drawing</span></div>
    <div className="diagram-source template-source"><div className="diagram-document"><div className="flex items-center justify-between"><FileSpreadsheet className="size-4 text-success" /><span className="font-mono text-[8px] text-muted-foreground">.XLSX</span></div><div className="mini-sheet mt-3" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} />)}</div></div><span>Your Excel template</span></div>
    <div className="diagram-connector first-connector" aria-hidden="true" /><div className="diagram-connector second-connector" aria-hidden="true" />
    <div className="diagram-engine" aria-hidden="true"><ZapMark /></div><div className="diagram-connector output-connector" aria-hidden="true" />
    <div className="diagram-output"><div className="diagram-document"><div className="flex items-center justify-between"><FileSpreadsheet className="size-5 text-success" /><span className="flex size-4 items-center justify-center rounded-full bg-success/10 text-success"><Check className="size-2.5" /></span></div><div className="mt-3 text-[9px] font-semibold">Electric schedule</div><div className="mini-sheet output-sheet mt-2" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} />)}</div><div className="mt-2 flex items-center gap-1 text-[7px] text-success"><ShieldCheck className="size-2.5" />New file. Original preserved.</div></div><span>Your generated schedule</span></div>
  </div>
}

function ZapMark() { return <Sparkles className="size-5" strokeWidth={1.6} /> }

const steps = [
  { icon: FileInput, title: "Upload", detail: "Add your drawing & template" },
  { icon: ScanLine, title: "Analyze", detail: "Extract, understand & map" },
  { icon: CheckCheck, title: "Review", detail: "You approve every change" },
  { icon: FileSpreadsheet, title: "Generate", detail: "Create a new workbook" },
  { icon: ArrowDownToLine, title: "Download", detail: "Schedule, reports & evidence" },
]

export function WorkflowSteps({ active = false }: { active?: boolean }) {
  return <ol className="workflow-steps grid grid-cols-2 gap-5 md:grid-cols-5 md:gap-3">{steps.map(({ icon: Icon, title, detail }, index) => <li key={title} className={cn("relative flex flex-col items-start gap-2", active && index === 0 && "active-step")}><div className="mb-1 flex w-full items-center gap-3"><span className="step-icon flex size-8 shrink-0 items-center justify-center rounded-lg"><Icon className="size-4" strokeWidth={1.6} /></span>{index < 4 && <div className="step-line h-px flex-1 bg-border" />}</div><div className="flex items-center gap-2"><span className="font-mono text-[9px] text-muted-foreground/65">0{index + 1}</span><span className="text-xs font-semibold">{title}</span></div><p className="text-[10px] leading-relaxed text-muted-foreground">{detail}</p></li>)}</ol>
}

export function ScheduleEmpty({ review = false, completed = false }: { review?: boolean; completed?: boolean }) {
  return <Empty className="py-10"><EmptyHeader><div className="empty-folder mb-2 flex size-12 items-center justify-center rounded-xl"><FolderOpen className="size-6" strokeWidth={1.3} /></div><EmptyTitle>{review ? "Nothing waiting for review" : completed ? "Your finished work will live here" : "Your first schedule starts here"}</EmptyTitle><EmptyDescription>{review ? "Mappings that need your approval will appear here once analysis is available." : completed ? "Validated workbooks and their reports will appear here after generation." : "Bring your drawing and template together. We’ll help with the rest."}</EmptyDescription></EmptyHeader>{!review && !completed && <EmptyContent><Button variant="outline" size="sm" render={<Link href="/schedules/new" />}><Plus data-icon="inline-start" />Create your first schedule</Button><span className="mt-1 text-[10px] text-muted-foreground">File preparation is available · Processing starts in Phase 2</span></EmptyContent>}</Empty>
}

export function Overview() {
  return <div className="flex flex-col gap-7">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="eyebrow mb-2">YOUR ENGINEERING WORKSPACE</div><h1 className="page-title">A clearer path from drawing to schedule.</h1><p className="mt-2 text-xs text-muted-foreground">Less manual entry. More confidence in every connection.</p></div><Button size="lg" render={<Link href="/schedules/new" />}><Plus data-icon="inline-start" />New schedule</Button></div>
    <section className="overview-hero relative grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[1fr_1fr]">
      <div className="relative z-10 flex flex-col items-start px-6 py-7 md:px-7"><span className="hero-label mb-4 inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[1px]"><span className="size-1.5 rounded-full bg-primary" />PRECISION IN. CONFIDENCE OUT.</span><h2 className="max-w-sm text-[30px] font-medium leading-[1.18] tracking-[-1.2px]">Your drawings.<br />Your template.<br /><span className="text-muted-foreground">One reliable schedule.</span></h2><p className="mb-5 mt-3 max-w-[300px] text-xs leading-relaxed text-muted-foreground">A thoughtful workflow that connects engineering data to your Excel format—with you in control.</p><Button size="lg" render={<Link href="/schedules/new" />}>Create a new schedule<ArrowRight data-icon="inline-end" /></Button><div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground"><ShieldCheck className="size-3.5 text-success" />Your original files are never modified.</div></div>
      <PipelineIllustration />
    </section>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Engineering safeguards">{[
      { icon: ShieldCheck, title: "Originals stay original", description: "Read-only source files. Always a new output.", tone: "green" },
      { icon: GitBranch, title: "Every value has a source", description: "From a drawing page to an exact Excel cell.", tone: "amber" },
      { icon: FileCheck2, title: "Your approval comes first", description: "Review, adjust, and approve before generation.", tone: "neutral" },
    ].map(({ icon: Icon, title, description, tone }) => <Card key={title} size="sm"><CardHeader className="flex-row items-start gap-3"><div className={cn("feature-icon mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", tone)}><Icon className="size-4" strokeWidth={1.5} /></div><div className="flex flex-col gap-1"><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div></CardHeader><CardContent className="hidden" /></Card>)}</section>
    <section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between px-5 pb-3 pt-5"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">Recent schedules</h2><span className="text-xs text-muted-foreground">—</span></div><Link href="/schedules" className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground">View all<ArrowRight className="size-3" /></Link></div><Tabs defaultValue="all"><TabsList variant="line" className="mx-5"><TabsTrigger value="all">All schedules</TabsTrigger><TabsTrigger value="review">In review</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger></TabsList><div className="border-t border-border"><TabsContent value="all"><ScheduleEmpty /></TabsContent><TabsContent value="review"><ScheduleEmpty review /></TabsContent><TabsContent value="completed"><ScheduleEmpty completed /></TabsContent></div></Tabs></section>
    <section className="pb-2"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold">Five steps. A fully traceable schedule.</h2><Link href="/guide" className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">How it works<ArrowRight className="size-3" /></Link></div><WorkflowSteps /></section>
  </div>
}
