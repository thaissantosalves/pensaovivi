const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const EXTENSION_META: Record<string, { mime: string; ext: string }> = {
  jpg: { mime: "image/jpeg", ext: "jpg" },
  jpeg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
  gif: { mime: "image/gif", ext: "gif" },
  heic: { mime: "image/heic", ext: "heic" },
  heif: { mime: "image/heif", ext: "heif" },
};

export const IMAGE_ACCEPT = "image/*";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function resolveImageFile(file: File) {
  const nameExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  const fromExt = EXTENSION_META[nameExt];

  if (file.type && ALLOWED_MIMES.has(file.type)) {
    return {
      mime: file.type,
      ext: fromExt?.ext ?? mimeToExt(file.type),
    };
  }

  if (fromExt) {
    return fromExt;
  }

  throw new Error("Use fotos JPG, PNG, WebP, GIF ou HEIC.");
}

export function validateImageFile(file: File) {
  resolveImageFile(file);

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    default:
      return "jpg";
  }
}
