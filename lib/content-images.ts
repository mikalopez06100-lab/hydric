import { SUPABASE_URL } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function fileExtension(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function uploadContentImage(
  folder: "recipes" | "exercises",
  itemId: string,
  file: File
): Promise<{ image_url: string } | { error: string }> {
  if (!ALLOWED.has(file.type)) {
    return { error: "Format non supporté (JPEG, PNG, WebP, GIF)" };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image trop volumineuse (max 5 Mo)" };
  }

  const ext = fileExtension(file.type);
  const path = `${folder}/${itemId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createAdminClient();

  const { error } = await admin.storage
    .from("content-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return { error: error.message };
  }

  const image_url = `${SUPABASE_URL}/storage/v1/object/public/content-images/${path}?t=${Date.now()}`;
  return { image_url };
}
