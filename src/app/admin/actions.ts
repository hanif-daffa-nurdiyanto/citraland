"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearCmsSession, createCmsSession, isCmsAuthenticated, passwordMatches, usernameMatches } from "@/lib/cms/auth";
import { deleteEntry, saveEntry, savePage, validateEntry, type CmsEntry, type CollectionName } from "@/lib/cms/repository";
import { validatePage, type PageDataMap, type PageName } from "@/lib/cms/schema";

export type ActionResult = { ok: boolean; error?: string; message?: string };
const collections: CollectionName[] = ["districts", "articles"];

export async function loginAction(_previous: { error: string }, formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  if (!usernameMatches(username) || !passwordMatches(password)) return { error: "Username atau password tidak sesuai." };
  await createCmsSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearCmsSession();
  redirect("/admin");
}

async function requireAuth() {
  if (!(await isCmsAuthenticated())) throw new Error("Sesi berakhir. Masuk kembali ke CMS.");
}

function validCollection(value: string): value is CollectionName {
  return collections.includes(value as CollectionName);
}

function refresh(slug?: string, oldSlug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/${oldSlug}`);
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}

export async function saveContentAction(collection: string, value: unknown, originalSlug?: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!validCollection(collection) || !validateEntry(collection, value)) return { ok: false, error: "Data tidak valid. Periksa semua field." };
    await saveEntry(collection, value as CmsEntry, originalSlug);
    refresh((value as CmsEntry).slug, originalSlug);
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Gagal menyimpan konten." }; }
}

export async function deleteContentAction(collection: string, slug: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!validCollection(collection) || !/^[a-z0-9-]+$/.test(slug)) return { ok: false, error: "Permintaan tidak valid." };
    await deleteEntry(collection, slug);
    refresh(slug);
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Gagal menghapus konten." }; }
}

export async function savePageAction<T extends PageName>(slug: T, data: PageDataMap[T]): Promise<ActionResult> {
  try {
    await requireAuth();
    if (!validatePage(slug, data)) return { ok: false, message: "Data halaman tidak valid." };
    await savePage(slug, data);
    refresh();
    return { ok: true, message: "Halaman berhasil disimpan." };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Gagal menyimpan halaman." }; }
}
