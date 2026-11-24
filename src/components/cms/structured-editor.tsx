"use client";

import Image from "next/image";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const labels: Record<string, string> = {
  slug: "Slug URL", title: "Judul", order: "Urutan", tagline: "Tagline", heroImage: "Gambar hero", heroImages: "Slideshow hero", heroDescription: "Deskripsi hero", intro: "Pengantar", introHighlights: "Poin pengantar", products: "Produk", features: "Keunggulan", faq: "FAQ", cardImage: "Gambar kartu", metaTitle: "Judul SEO", description: "Deskripsi", image: "Gambar utama", body: "Isi artikel", question: "Pertanyaan", answer: "Jawaban", gallery: "Galeri", text: "Teks", type: "Jenis blok", eyebrow: "Eyebrow", images: "Gambar", about: "Tentang", hero: "Hero", cta: "CTA", seo: "SEO", label: "Label tombol", whatsapp: "Nomor WhatsApp", whatsappMessage: "Pesan awal WhatsApp", email: "Email", address: "Alamat",
};
const longText = new Set(["description", "heroDescription", "intro", "answer", "text", "whatsappMessage"]);
const fieldLabel = (key: string) => labels[key] || key.replace(/([A-Z])/g, " $1");
const imageKey = (key: string) => /image/i.test(key);

export function StructuredEditor({ title, description, value, onChange }: { title: string; description: string; value: object; onChange: (value: never) => void }) {
  function update(path: (string | number)[], nextValue: unknown) {
    const clone = structuredClone(value) as Record<string, unknown>;
    let target: Record<string, unknown> | unknown[] = clone;
    for (const part of path.slice(0, -1)) target = Array.isArray(target) ? target[Number(part)] as Record<string, unknown> : target[String(part)] as Record<string, unknown>;
    if (Array.isArray(target)) target[Number(path.at(-1))] = nextValue;
    else target[String(path.at(-1))] = nextValue;
    onChange(clone as never);
  }

  async function upload(file: File, path: (string | number)[]) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload gagal");
    update(path, result.url);
  }

  function primitive(key: string, item: string | number, path: (string | number)[]) {
    const id = path.join("-");
    if (imageKey(key) && typeof item === "string") {
      const uploadId = `${id}-upload`;
      const nestedArrayImage = path.some((part) => typeof part === "number");

      return (
        <div className="space-y-3" key={id}>
          <Label>{fieldLabel(key)}</Label>
          {item ? (
            <div className="relative h-48 w-full max-w-md overflow-hidden rounded-lg border border-border bg-secondary">
              <Image src={item} alt={fieldLabel(key)} fill sizes="448px" className="object-cover" />
            </div>
          ) : (
            <div className="grid h-36 w-full max-w-md place-items-center rounded-lg border border-dashed border-input bg-secondary/40 text-sm text-muted-foreground">
              Belum ada gambar
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={uploadId} className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              <Upload size={16} /> {item ? "Ganti gambar" : "Pilih gambar"}
            </label>
            <input
              id={uploadId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try { await upload(file, path); }
                catch (error) { alert(error instanceof Error ? error.message : "Upload gagal"); }
                event.target.value = "";
              }}
            />
            {item && !nestedArrayImage ? (
              <Button type="button" variant="ghost" onClick={() => update(path, "")}>
                <Trash2 size={16} /> Hapus gambar
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG, atau WebP. Maksimal 5 MB.</p>
        </div>
      );
    }

    return <div className="space-y-2" key={id}>
      <Label htmlFor={id}>{key === "description" && path.includes("seo") ? "Deskripsi SEO" : fieldLabel(key)}</Label>
      {longText.has(key) ? <Textarea id={id} value={String(item)} rows={4} onChange={(event) => update(path, event.target.value)} /> : <Input id={id} type={typeof item === "number" ? "number" : "text"} value={item} onChange={(event) => update(path, typeof item === "number" ? Number(event.target.value) : event.target.value)} />}
      {key === "slug" ? <p className="text-xs text-muted-foreground">Gunakan huruf kecil, angka, dan tanda hubung.</p> : null}
    </div>;
  }

  function renderField(key: string, item: unknown, path: (string | number)[]): React.ReactNode {
    if (typeof item === "string" || typeof item === "number") return primitive(key, item, path);
    if (Array.isArray(item)) {
      const strings = item.every((part) => typeof part === "string");
      if (strings && !imageKey(key)) return <div className="space-y-2" key={path.join("-")}><Label>{fieldLabel(key)}</Label><Textarea rows={Math.min(10, Math.max(4, item.length + 1))} value={item.join("\n")} onChange={(event) => update(path, event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))} /><p className="text-xs text-muted-foreground">Satu item per baris.</p></div>;
      return <div className="space-y-3" key={path.join("-")}><Label>{fieldLabel(key)}</Label>{item.map((part, index) => <div className="space-y-4 rounded-lg border border-border bg-background p-4" key={`${path.join("-")}-${index}`}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground">Item {index + 1}</span><Button type="button" size="sm" variant="ghost" onClick={() => update(path, item.filter((_, i) => i !== index))}><Trash2 size={15} /> Hapus</Button></div>{strings ? primitive("image", String(part), [...path, index]) : Object.entries(part as Record<string, unknown>).map(([childKey, child]) => renderField(childKey, child, [...path, index, childKey]))}</div>)}<Button type="button" size="sm" variant="outline" onClick={() => { const sample = item[0]; const blank = typeof sample === "string" ? "" : sample && typeof sample === "object" ? blankValue(sample) : ""; update(path, [...item, blank]); }}><Plus size={15} /> Tambah item</Button></div>;
    }
    if (item && typeof item === "object") return <fieldset className="space-y-4 rounded-lg border border-border p-4" key={path.join("-")}><legend className="px-2 text-sm font-semibold">{fieldLabel(key)}</legend>{Object.entries(item as Record<string, unknown>).map(([childKey, child]) => renderField(childKey, child, [...path, childKey]))}</fieldset>;
    return null;
  }

  return <Card className="w-full"><CardHeader><CardTitle className="text-lg">{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="space-y-6">{Object.entries(value).filter(([key]) => key !== "updatedAt").map(([key, item]) => renderField(key, item, [key]))}</CardContent></Card>;
}

function blankValue(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankValue(item)]));
  return null;
}
