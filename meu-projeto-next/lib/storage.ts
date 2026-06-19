import { createAdminClient } from "@/lib/supabase/admin";

export const PRODUCT_IMAGES_BUCKET = "product-images";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function getPublicImageUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  return `${url}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${path}`;
}

export function pathFromPublicUrl(imageUrl: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index === -1) return null;
  return imageUrl.slice(index + marker.length);
}

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use JPG, PNG, WebP ou GIF.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }
}

function extensionForType(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<string> {
  validateImageFile(file);

  const supabase = createAdminClient();
  const ext = extensionForType(file.type);
  const path = `${productId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return getPublicImageUrl(path);
}

export async function deleteProductImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  const path = pathFromPublicUrl(imageUrl);
  if (!path) return;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
