import path from "node:path";

export const uploadTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export const extensionTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function uploadDirectory() {
  const configured = process.env.UPLOAD_DIR?.trim();
  return configured
    ? path.resolve(configured)
    : path.join(process.cwd(), "storage", "uploads");
}

export function validUploadFilename(filename: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(filename);
}
