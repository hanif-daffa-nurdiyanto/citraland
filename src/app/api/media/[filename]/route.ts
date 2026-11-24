import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { extensionTypes, uploadDirectory, validUploadFilename } from "@/lib/cms/upload-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!validUploadFilename(filename)) {
    return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 });
  }

  try {
    const buffer = await readFile(path.join(uploadDirectory(), filename));
    const extension = filename.split(".").at(-1)?.toLowerCase() || "";

    return new Response(buffer, {
      headers: {
        "Content-Type": extensionTypes[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 404 });
  }
}
