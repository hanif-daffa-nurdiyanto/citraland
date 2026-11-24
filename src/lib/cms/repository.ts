import { Pool, type PoolClient } from "pg";
import districtSeed from "@/data/districts.json";
import articleSeed from "@/data/articles.json";
import { defaultPages, validatePage, type PageDataMap, type PageName } from "@/lib/cms/schema";

export type CollectionName = "districts" | "articles";
export type DistrictEntry = (typeof districtSeed)[number];
export type ArticleEntry = (typeof articleSeed)[number];
export type CmsEntry = DistrictEntry | ArticleEntry;
export type CmsListEntry = CmsEntry & { updatedAt?: string };

const seeds = { districts: districtSeed, articles: articleSeed };
const pageTitles: Record<PageName, string> = { home: "Home", contact: "Kontak & CTA" };
const globalCms = globalThis as typeof globalThis & { citralandCmsPool?: Pool; citralandCmsSchema?: Promise<void> };

function pool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum diatur.");
  if (!globalCms.citralandCmsPool) globalCms.citralandCmsPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 3000 });
  return globalCms.citralandCmsPool;
}

async function ensureSchema() {
  if (!globalCms.citralandCmsSchema) {
    globalCms.citralandCmsSchema = (async () => {
      await pool().query(`CREATE TABLE IF NOT EXISTS citraland_cms_entries (collection TEXT NOT NULL, slug TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (collection, slug))`);
      await pool().query(`CREATE TABLE IF NOT EXISTS citraland_cms_collections (collection TEXT PRIMARY KEY, seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
      await pool().query(`CREATE TABLE IF NOT EXISTS citraland_cms_pages (slug TEXT PRIMARY KEY, title TEXT NOT NULL, data JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    })().catch((error) => { globalCms.citralandCmsSchema = undefined; throw error; });
  }
  await globalCms.citralandCmsSchema;
}

async function seedCollection(client: PoolClient, collection: CollectionName) {
  const marker = await client.query(`INSERT INTO citraland_cms_collections (collection) VALUES ($1) ON CONFLICT DO NOTHING RETURNING collection`, [collection]);
  if (!marker.rowCount) return;
  for (const entry of seeds[collection]) {
    await client.query(`INSERT INTO citraland_cms_entries (collection, slug, position, data) VALUES ($1, $2, $3, $4::jsonb) ON CONFLICT DO NOTHING`, [collection, entry.slug, entry.order, JSON.stringify(entry)]);
  }
}

async function prepare(collection: CollectionName) {
  await ensureSchema();
  const client = await pool().connect();
  try { await client.query("BEGIN"); await seedCollection(client, collection); await client.query("COMMIT"); }
  catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}

export async function listCollection(collection: "districts", strict?: boolean): Promise<DistrictEntry[]>;
export async function listCollection(collection: "articles", strict?: boolean): Promise<ArticleEntry[]>;
export async function listCollection(collection: CollectionName, strict?: boolean): Promise<CmsEntry[]>;
export async function listCollection(collection: CollectionName, strict = false): Promise<CmsEntry[]> {
  if (!process.env.DATABASE_URL) {
    if (strict) throw new Error("DATABASE_URL belum diatur.");
    return [...seeds[collection]] as CmsEntry[];
  }
  try {
    await prepare(collection);
    const result = await pool().query(`SELECT data, updated_at FROM citraland_cms_entries WHERE collection = $1 ORDER BY position ASC, slug ASC`, [collection]);
    return result.rows.map((row: { data: CmsEntry; updated_at: Date | string }) => ({ ...row.data, updatedAt: new Date(row.updated_at).toISOString() }));
  } catch (error) {
    if (strict) throw error;
    return [...seeds[collection]] as CmsEntry[];
  }
}

export async function getEntry(collection: CollectionName, slug: string) {
  return (await listCollection(collection)).find((entry) => entry.slug === slug);
}

function sameShape(sample: unknown, value: unknown): boolean {
  if (Array.isArray(sample)) return Array.isArray(value) && (!sample.length || value.every((item) => sameShape(sample[0], item)));
  if (sample && typeof sample === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return Object.keys(sample).filter((key) => key !== "updatedAt").every((key) => sameShape((sample as Record<string, unknown>)[key], (value as Record<string, unknown>)[key]));
  }
  return typeof value === typeof sample;
}

export function validateEntry(collection: CollectionName, value: unknown): value is CmsEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) && entry.slug.length <= 120 && typeof entry.title === "string" && Boolean(entry.title.trim()) && entry.title.length <= 180 && typeof entry.order === "number" && Number.isInteger(entry.order) && entry.order >= 0 && sameShape(seeds[collection][0], value);
}

export async function saveEntry(collection: CollectionName, entry: CmsEntry, originalSlug?: string) {
  if (!validateEntry(collection, entry)) throw new Error("Data tidak valid. Periksa semua field.");
  await prepare(collection);
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    if (originalSlug && originalSlug !== entry.slug) await client.query(`DELETE FROM citraland_cms_entries WHERE collection = $1 AND slug = $2`, [collection, originalSlug]);
    await client.query(`INSERT INTO citraland_cms_entries (collection, slug, position, data) VALUES ($1, $2, $3, $4::jsonb) ON CONFLICT (collection, slug) DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data, updated_at = NOW()`, [collection, entry.slug, entry.order, JSON.stringify(entry)]);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
}

export async function deleteEntry(collection: CollectionName, slug: string) {
  await prepare(collection);
  const result = await pool().query(`DELETE FROM citraland_cms_entries WHERE collection = $1 AND slug = $2`, [collection, slug]);
  if (!result.rowCount) throw new Error("Konten tidak ditemukan.");
}

function mergePageData<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as T;
  if (defaults !== null && typeof defaults === "object") {
    const source = saved !== null && typeof saved === "object" && !Array.isArray(saved) ? saved as Record<string, unknown> : {};
    return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, mergePageData(value, source[key])])) as T;
  }
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}

export async function getPage<T extends PageName>(slug: T, strict = false): Promise<PageDataMap[T]> {
  if (!process.env.DATABASE_URL) {
    if (strict) throw new Error("DATABASE_URL belum diatur.");
    return defaultPages[slug];
  }
  try {
    await ensureSchema();
    const result = await pool().query(`SELECT data FROM citraland_cms_pages WHERE slug = $1`, [slug]);
    return mergePageData(defaultPages[slug], result.rows[0]?.data ?? {});
  } catch (error) {
    if (strict) throw error;
    return defaultPages[slug];
  }
}

export async function savePage<T extends PageName>(slug: T, data: PageDataMap[T]) {
  if (!validatePage(slug, data)) throw new Error("Data halaman tidak valid.");
  await ensureSchema();
  await pool().query(`INSERT INTO citraland_cms_pages (slug, title, data) VALUES ($1, $2, $3::jsonb) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, data = EXCLUDED.data, updated_at = NOW()`, [slug, pageTitles[slug], JSON.stringify(data)]);
}
