import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isCmsAuthenticated } from "@/lib/cms/auth";
import { uploadDirectory, uploadTypes } from "@/lib/cms/upload-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isCmsAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 }
    );
  }

  const extension = uploadTypes.get(file.type);

  if (!extension) {
    return NextResponse.json(
      { error: "Gunakan JPG, PNG, atau WebP" },
      { status: 400 }
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran maksimal 5MB" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validasi signature dasar, bukan hanya MIME dari browser.
  const isJpeg =
    buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));

  const isPng =
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );

  const isWebp =
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  const valid =
    (extension === "jpg" && isJpeg) ||
    (extension === "png" && isPng) ||
    (extension === "webp" && isWebp);

  if (!valid) {
    return NextResponse.json(
      { error: "Format gambar tidak valid" },
      { status: 400 }
    );
  }

  const filename = `${randomUUID()}.${extension}`;
  const directory = uploadDirectory();

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), buffer, { flag: "wx" });
  } catch (error) {
    console.error("Gagal menyimpan upload CMS:", error);
    return NextResponse.json(
      { error: "Penyimpanan gambar tidak tersedia" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: `/api/media/${filename}`,
  });
}
