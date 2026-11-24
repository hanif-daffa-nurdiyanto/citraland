"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, Copy, ExternalLink, Eye, FileText, Home, LogOut, Mail, Pencil, Plus, Save, Search, Trash2 } from "lucide-react";
import { deleteContentAction, logoutAction, saveContentAction, savePageAction } from "@/app/admin/actions";
import { StructuredEditor } from "@/components/cms/structured-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ArticleEntry, CmsEntry, CmsListEntry, CollectionName, DistrictEntry } from "@/lib/cms/repository";
import type { ContactContent, HomeContent, PageName } from "@/lib/cms/schema";

type CmsView = CollectionName | PageName;
type DashboardData = { districts: DistrictEntry[]; articles: ArticleEntry[]; pages: { home: HomeContent; contact: ContactContent } };
type PageDraft = { page: "home"; value: HomeContent } | { page: "contact"; value: ContactContent } | null;

const collections = [
  { id: "districts" as const, label: "Kawasan", icon: Building2 },
  { id: "articles" as const, label: "Artikel", icon: FileText },
];
const pages = [
  { id: "home" as const, label: "Home", icon: Home, path: "/" },
  { id: "contact" as const, label: "Kontak & CTA", icon: Mail, path: "/#kontak" },
];

function resolveView(value: string | null): CmsView {
  return value === "home" || value === "contact" || value === "districts" || value === "articles" ? value : "home";
}
function isCollection(value: CmsView): value is CollectionName { return value === "districts" || value === "articles"; }
function blankValue(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "updatedAt").map(([key, item]) => [key, blankValue(item)]));
  return null;
}
function formatDate(value: string) { return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }

export function CmsDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeView = resolveView(searchParams.get("edit"));
  const collection: CollectionName = isCollection(activeView) ? activeView : "districts";
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<CmsEntry | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [pageDraft, setPageDraft] = useState<PageDraft>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const entries = data[collection] as CmsListEntry[];
  const visible = useMemo(() => entries.filter((entry) => `${entry.title} ${entry.slug}`.toLowerCase().includes(query.toLowerCase())), [entries, query]);
  const currentCollection = collections.find((item) => item.id === collection)!;
  const currentPage = pages.find((item) => item.id === activeView);
  const homeDraft = activeView === "home" ? pageDraft?.page === "home" ? pageDraft.value : data.pages.home : null;
  const contactDraft = activeView === "contact" ? pageDraft?.page === "contact" ? pageDraft.value : data.pages.contact : null;

  function navigate(view: CmsView) {
    if (busy || view === activeView) return;
    setDraft(null); setOriginalSlug(null); setPageDraft(null); setQuery(""); setMessage(""); setConfirmDelete(false);
    router.push(`/admin?edit=${view}`, { scroll: false });
  }
  function closeEditor() { setDraft(null); setOriginalSlug(null); setConfirmDelete(false); }
  function edit(entry: CmsEntry) { setDraft(structuredClone(entry)); setOriginalSlug(entry.slug); setMessage(""); setConfirmDelete(false); }
  function create() {
    const sample = entries[0];
    if (!sample) return setMessage("Belum ada template konten untuk kategori ini.");
    const next = blankValue(sample) as CmsEntry;
    next.order = Math.max(...entries.map((entry) => entry.order), -1) + 1;
    setDraft(next); setOriginalSlug(null); setMessage("");
  }
  function duplicate(entry: CmsEntry) {
    const next = structuredClone(entry) as CmsEntry;
    next.slug = `${entry.slug}-salinan`; next.title = `${entry.title} (Salinan)`; next.order = Math.max(...entries.map((item) => item.order), -1) + 1;
    setDraft(next); setOriginalSlug(null); setMessage("");
  }
  async function save() {
    if (!draft || busy) return;
    setBusy(true); setMessage("");
    const result = await saveContentAction(collection, draft, originalSlug || undefined);
    if (result.ok) { closeEditor(); setMessage("Konten berhasil disimpan."); router.refresh(); }
    else setMessage(result.error || "Gagal menyimpan konten.");
    setBusy(false);
  }
  async function remove() {
    if (!originalSlug || busy) return;
    if (!confirmDelete) return setConfirmDelete(true);
    setBusy(true); setMessage("");
    const result = await deleteContentAction(collection, originalSlug);
    if (result.ok) { closeEditor(); setMessage("Konten berhasil dihapus."); router.refresh(); }
    else setMessage(result.error || "Gagal menghapus konten.");
    setBusy(false);
  }
  async function deleteFromList(entry: CmsEntry) {
    if (busy || !window.confirm(`Yakin ingin menghapus "${entry.title}"?`)) return;
    setBusy(true); setMessage("");
    const result = await deleteContentAction(collection, entry.slug);
    setMessage(result.ok ? "Konten berhasil dihapus." : result.error || "Gagal menghapus konten.");
    if (result.ok) router.refresh();
    setBusy(false);
  }
  async function saveSinglePage() {
    if (busy) return;
    setBusy(true); setMessage("");
    const result = activeView === "home" && homeDraft ? await savePageAction("home", homeDraft) : activeView === "contact" && contactDraft ? await savePageAction("contact", contactDraft) : { ok: false, message: "Halaman tidak ditemukan." };
    setMessage(result.ok ? "Halaman berhasil disimpan." : result.message || "Gagal menyimpan halaman.");
    if (result.ok) router.refresh();
    setBusy(false);
  }
  const openWebsite = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
  const isPageView = !isCollection(activeView);

  return <div className="cms-shell"><div className="flex min-h-svh flex-col lg:flex-row">
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card p-5 lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:border-r lg:border-b-0">
      <div className="mb-8"><p className="text-xl font-semibold tracking-tight">CitraLand <span className="text-primary">CMS</span></p><p className="mt-1 text-xs text-muted-foreground">Content workspace</p></div>
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="CMS">
        <div className="mb-2 hidden px-3 text-xs font-semibold uppercase text-muted-foreground lg:block">Pages</div>
        {pages.map((item) => <NavButton key={item.id} active={activeView === item.id} disabled={busy} icon={item.icon} label={item.label} onClick={() => navigate(item.id)} />)}
        <div className="mt-5 mb-2 hidden px-3 text-xs font-semibold uppercase text-muted-foreground lg:block">Collections</div>
        {collections.map((item) => <NavButton key={item.id} active={activeView === item.id} disabled={busy} icon={item.icon} label={item.label} count={data[item.id].length} onClick={() => navigate(item.id)} />)}
      </nav>
      <div className="mt-auto hidden space-y-2 border-t border-border pt-5 lg:block"><Button variant="ghost" className="w-full justify-start" onClick={() => openWebsite("/")}><ExternalLink size={16} />Lihat situs</Button><form action={logoutAction}><Button variant="ghost" className="w-full justify-start" type="submit"><LogOut size={16} />Keluar</Button></form></div>
    </aside>
    <main className="min-w-0 flex-1 p-5 md:p-8 xl:p-10"><div className="mx-auto max-w-7xl">
      <div className="sticky top-0 z-40 flex min-h-20 flex-wrap items-center justify-between gap-4 bg-background py-4">
        <div className="flex items-center gap-3">{!isPageView && draft ? <Button variant="ghost" size="icon" disabled={busy} onClick={closeEditor} aria-label="Kembali"><ArrowLeft size={20} /></Button> : null}<div><h1 className="text-2xl font-semibold tracking-tight">{isPageView ? `Edit ${currentPage?.label}` : draft ? originalSlug ? `Edit ${currentCollection.label}` : `Tambah ${currentCollection.label}` : currentCollection.label}</h1>{draft ? <p className="mt-1 text-sm text-muted-foreground">{draft.title || "Konten baru"}</p> : null}</div></div>
        <div className="flex flex-wrap items-center gap-2">{isPageView ? <><Button variant="outline" onClick={() => openWebsite(currentPage?.path || "/")}><ExternalLink size={16} />Lihat Halaman</Button><Button disabled={busy} onClick={saveSinglePage}><Save size={16} />{busy ? "Menyimpan..." : "Simpan"}</Button></> : <><Button variant="outline" onClick={() => openWebsite(draft?.slug ? `/${draft.slug}` : collection === "articles" ? "/blog" : "/#kawasan")}><ExternalLink size={16} />{draft ? "Lihat Detail" : "Lihat Halaman"}</Button>{draft ? <>{originalSlug ? <Button variant="destructive" disabled={busy} onClick={remove}><Trash2 size={16} />Hapus</Button> : null}<Button disabled={busy} onClick={save}><Save size={16} />{busy ? "Menyimpan..." : "Simpan"}</Button></> : <Button disabled={busy} onClick={create}><Plus size={16} />Tambah Baru</Button>}</>}</div>
      </div>
      {message ? <div role="status" className={`mb-5 rounded-md border px-4 py-3 text-sm ${message.includes("berhasil") ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{message}</div> : null}
      {homeDraft ? <StructuredEditor title="Konten Home" description="Hero, pengantar, CTA, dan metadata halaman utama." value={homeDraft} onChange={(value) => setPageDraft({ page: "home", value: value as HomeContent })} /> : null}
      {contactDraft ? <StructuredEditor title="Kontak & CTA" description="Informasi yang dipakai tombol WhatsApp dan footer situs." value={contactDraft} onChange={(value) => setPageDraft({ page: "contact", value: value as ContactContent })} /> : null}
      {!isPageView ? draft ? <StructuredEditor title={originalSlug ? "Edit konten" : "Konten baru"} description={`${currentCollection.label} · perubahan tersimpan di PostgreSQL`} value={draft} onChange={(value) => setDraft(value as CmsEntry)} /> : <CollectionList title={currentCollection.label} entries={entries} visible={visible} query={query} busy={busy} onQuery={setQuery} onEdit={edit} onView={(entry) => openWebsite(`/${entry.slug}`)} onDuplicate={duplicate} onDelete={deleteFromList} /> : null}
      {confirmDelete ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">Klik tombol Hapus sekali lagi untuk menghapus konten ini secara permanen.</div> : null}
      <div className="mt-8 flex gap-3 lg:hidden"><Link href="/" className="text-sm text-primary">Lihat situs</Link><form action={logoutAction}><button type="submit" className="text-sm text-primary">Keluar</button></form></div>
    </div></main>
  </div></div>;
}

function NavButton({ active, disabled, icon: Icon, label, count, onClick }: { active: boolean; disabled: boolean; icon: typeof Home; label: string; count?: number; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent"}`}><Icon size={17} />{label}{count !== undefined ? <span className="ml-auto text-xs opacity-60">{count}</span> : null}</button>;
}

function CollectionList({ title, entries, visible, query, busy, onQuery, onEdit, onView, onDuplicate, onDelete }: { title: string; entries: CmsListEntry[]; visible: CmsListEntry[]; query: string; busy: boolean; onQuery: (value: string) => void; onEdit: (entry: CmsEntry) => void; onView: (entry: CmsEntry) => void; onDuplicate: (entry: CmsEntry) => void; onDelete: (entry: CmsEntry) => void }) {
  return <Card className="w-full"><CardHeader><CardTitle className="text-lg">Daftar {title.toLowerCase()}</CardTitle><CardDescription>{entries.length} konten tersedia</CardDescription><div className="relative mt-3"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} /><Input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Cari judul atau slug..." className="pl-9" /></div></CardHeader><CardContent className="space-y-2">{visible.length ? visible.map((entry) => <div key={entry.slug} className="group flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary/40 hover:bg-secondary/30"><button type="button" className="min-w-0 flex-1 text-left" onClick={() => onEdit(entry)}><span className="line-clamp-2 text-sm font-medium">{entry.title}</span>{entry.updatedAt ? <span className="mt-1 block text-xs text-muted-foreground">Diedit {formatDate(entry.updatedAt)}</span> : null}</button><TooltipProvider delayDuration={200}><div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100"><Action icon={Pencil} label="Edit konten" onClick={() => onEdit(entry)} /><Action icon={Eye} label="Lihat halaman" onClick={() => onView(entry)} /><Action icon={Copy} label="Duplikasi konten" onClick={() => onDuplicate(entry)} /><Action icon={Trash2} label="Hapus konten" destructive disabled={busy} onClick={() => onDelete(entry)} /></div></TooltipProvider></div>) : <p className="py-6 text-center text-sm text-muted-foreground">Konten tidak ditemukan.</p>}</CardContent></Card>;
}

function Action({ icon: Icon, label, onClick, destructive, disabled }: { icon: typeof Pencil; label: string; onClick: () => void; destructive?: boolean; disabled?: boolean }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={disabled} aria-label={label} className={destructive ? "text-destructive hover:bg-destructive/10 hover:text-destructive" : ""} onClick={onClick}><Icon size={16} /></Button></TooltipTrigger><TooltipContent><p>{label}</p></TooltipContent></Tooltip>;
}
