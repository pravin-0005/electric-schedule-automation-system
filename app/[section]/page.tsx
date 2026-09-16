import { notFound } from "next/navigation"
import { CollectionPage, GuidePage, SettingsPage } from "@/components/workspace-pages"

export function generateStaticParams() {
  return ["schedules", "templates", "history", "guide", "settings"].map(section => ({ section }))
}

export default async function WorkspacePage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (section === "guide") return <GuidePage />
  if (section === "settings") return <SettingsPage />
  if (section === "schedules" || section === "templates" || section === "history") return <CollectionPage kind={section} />
  notFound()
}
