import { createAdminClient } from "@/lib/supabase/admin";
import { resolveImageFile, validateImageFile } from "@/lib/image-file";

export const PRODUCT_IMAGES_BUCKET = "product-images";

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

export { validateImageFile } from "@/lib/image-file";

export async function uploadProductImage(
  productId: string,
  file: File
): Promise<string> {
  validateImageFile(file);

  const { mime, ext } = resolveImageFile(file);
  const supabase = createAdminClient();
  const path = `${productId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, buffer, {
      contentType: mime,
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
