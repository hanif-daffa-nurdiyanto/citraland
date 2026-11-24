import type { Metadata } from "next";
import { cmsConfigured, isCmsAuthenticated } from "@/lib/cms/auth";
import { getPage, listCollection } from "@/lib/cms/repository";
import { LoginForm } from "@/components/cms/login-form";
import { CmsDashboard } from "@/components/cms/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "CMS | CitraLand Makassar", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!cmsConfigured()) return <AdminState title="CMS belum dikonfigurasi">Isi CMS_USERNAME, CMS_PASSWORD, dan CMS_SESSION_SECRET di environment lokal, lalu jalankan ulang server.</AdminState>;
  if (!(await isCmsAuthenticated())) return <LoginForm />;
  try {
    const [districts, articles, home, contact] = await Promise.all([
      listCollection("districts", true), listCollection("articles", true), getPage("home", true), getPage("contact", true),
    ]);
    return <CmsDashboard data={{ districts, articles, pages: { home, contact } }} />;
  } catch (error) {
    console.error("Gagal memuat CMS CitraLand:", error);
    return <AdminState title="Database belum dapat diakses">Periksa PostgreSQL dan DATABASE_URL. Halaman publik tetap memakai data JSON selama database belum tersedia.</AdminState>;
  }
}

function AdminState({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="cms-shell flex min-h-svh items-center justify-center p-6"><div className="max-w-lg rounded-xl border border-border bg-white p-8"><h1 className="text-2xl font-semibold">{title}</h1><p className="mt-3 text-sm text-muted-foreground">{children}</p></div></div>;
}
