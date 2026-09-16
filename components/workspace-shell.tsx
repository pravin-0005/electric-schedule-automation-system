"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ArrowUpRight, BookOpen, ChevronDown, ChevronRight, FileSpreadsheet, FolderOpen, History, LayoutGrid, LifeBuoy, Menu, Settings2, ShieldCheck, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/schedules", label: "Schedules", icon: FolderOpen },
  { href: "/templates", label: "Template library", icon: FileSpreadsheet },
  { href: "/history", label: "Processing history", icon: History },
]

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const current = pathname === "/schedules/new" ? "New schedule" : [...navigation, { href: "/settings", label: "Settings" }, { href: "/guide", label: "Workspace guide" }].find(item => item.href === pathname)?.label ?? "Workspace"

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3">Skip to content</a>
      {menuOpen && <button className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={cn("workspace-sidebar fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0", menuOpen ? "translate-x-0" : "-translate-x-full")}>
        <Link href="/" className="flex h-[76px] items-center gap-3 px-6" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark flex size-8 items-center justify-center rounded-lg"><Zap className="size-5" fill="currentColor" strokeWidth={1.5} /></span>
          <span className="text-lg font-semibold tracking-[-0.7px]">electric<span className="text-sidebar-foreground/45">schedule</span><span className="text-primary">.</span></span>
        </Link>
        <div className="mx-4 mb-7 flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/45 px-3 py-3">
          <span className="flex size-8 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent text-xs font-semibold">EW</span>
          <div className="flex flex-1 flex-col gap-0.5"><span className="text-xs font-medium">Engineering workspace</span><span className="text-[10px] text-sidebar-foreground/45">Phase 1 · Foundation</span></div>
          <ShieldCheck className="size-3.5 text-sidebar-foreground/40" aria-label="Foundation workspace" />
        </div>
        <span className="mb-3 px-6 text-[9px] font-semibold tracking-[1.6px] text-sidebar-foreground/35">WORKSPACE</span>
        <nav className="flex flex-col gap-1 px-3" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === href : pathname.startsWith(href)
            return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={cn("sidebar-link flex items-center gap-3 rounded-md px-3 py-2.5 text-xs", active && "is-active")}><Icon className="size-4" strokeWidth={1.6} />{label}{active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}</Link>
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-4 px-3 pb-4 pt-12">
          <div className="mx-1 rounded-lg border border-sidebar-border p-3.5">
            <ShieldCheck className="mb-2.5 size-5 text-primary" strokeWidth={1.5} />
            <p className="text-xs font-medium">Your template. Untouched.</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-sidebar-foreground/45">Every schedule starts from a copy. Your originals stay yours.</p>
            <Link href="/guide#source-safety" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium text-sidebar-foreground/75">Our safety principles <ArrowUpRight className="size-3" /></Link>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Workspace resources">
            <Link href="/settings" onClick={() => setMenuOpen(false)} className={cn("sidebar-link flex items-center gap-3 rounded-md px-3 py-2.5 text-xs", pathname === "/settings" && "is-active")}><Settings2 className="size-4" strokeWidth={1.6} />Settings</Link>
            <button onClick={() => { setHelpOpen(true); setMenuOpen(false) }} className="sidebar-link flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs"><LifeBuoy className="size-4" strokeWidth={1.6} />Help & resources<ArrowUpRight className="ml-auto size-3" /></button>
          </nav>
          <div className="flex items-center gap-3 border-t border-sidebar-border px-2 pt-4"><span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium">ES</span><div className="flex flex-col gap-0.5"><span className="text-xs">Electric Schedule</span><span className="text-[10px] text-sidebar-foreground/40">Development workspace</span></div></div>
        </div>
      </aside>
      <div className="lg:ml-56">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 md:px-8">
          <div className="flex items-center gap-3 text-xs"><Button size="icon-sm" variant="ghost" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden" aria-label="Open navigation">{menuOpen ? <X /> : <Menu />}</Button><span className="hidden text-muted-foreground sm:block">Workspace</span><ChevronRight className="hidden size-3 text-muted-foreground/60 sm:block" /><span className="font-medium">{current}</span></div>
          <div className="flex items-center gap-5"><Link href="/guide" className="hidden items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:flex"><BookOpen className="size-3.5" />Quick start guide</Link><span className="header-environment inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"><span className="size-1.5 rounded-full bg-current" />Development</span></div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-[1440px] px-5 py-7 md:px-8 md:py-8">{children}</main>
        <footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t border-border py-4 text-[10px] text-muted-foreground md:mx-8"><span>Electric Schedule Automation System</span><span className="flex items-center gap-1.5"><ShieldCheck className="size-3" />Engineered for accuracy. Designed for trust.</span></footer>
      </div>
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}><DialogContent><DialogHeader><DialogTitle>A little guidance goes a long way.</DialogTitle><DialogDescription>Explore the workflow, safety rules, and implementation status.</DialogDescription></DialogHeader><div className="flex flex-col gap-2"><Button variant="outline" render={<Link href="/guide" onClick={() => setHelpOpen(false)} />}><BookOpen data-icon="inline-start" />Read the workspace guide</Button><Button variant="outline" render={<Link href="/settings" onClick={() => setHelpOpen(false)} />}><Settings2 data-icon="inline-start" />Check system status</Button></div><p className="text-xs leading-relaxed text-muted-foreground">This is the Phase 1 foundation. File transfer, document analysis, review, and workbook generation are not enabled yet.</p></DialogContent></Dialog>
    </div>
  )
}
