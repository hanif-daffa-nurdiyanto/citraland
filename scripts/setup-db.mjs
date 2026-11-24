import { readFile } from "node:fs/promises";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diatur di .env");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
const collections = ["districts", "articles"];

try {
  await pool.query(`CREATE TABLE IF NOT EXISTS citraland_cms_entries (collection TEXT NOT NULL, slug TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (collection, slug))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS citraland_cms_collections (collection TEXT PRIMARY KEY, seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS citraland_cms_pages (slug TEXT PRIMARY KEY, title TEXT NOT NULL, data JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  for (const collection of collections) {
    const entries = JSON.parse(await readFile(new URL(`../src/data/${collection}.json`, import.meta.url), "utf8"));
    const marker = await pool.query(`INSERT INTO citraland_cms_collections (collection) VALUES ($1) ON CONFLICT DO NOTHING RETURNING collection`, [collection]);
    if (!marker.rowCount) continue;
    for (const entry of entries) await pool.query(`INSERT INTO citraland_cms_entries (collection, slug, position, data) VALUES ($1, $2, $3, $4::jsonb) ON CONFLICT DO NOTHING`, [collection, entry.slug, entry.order, JSON.stringify(entry)]);
  }
  console.log("Database CMS CitraLand siap.");
} catch (error) {
  console.error("Setup database gagal:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
