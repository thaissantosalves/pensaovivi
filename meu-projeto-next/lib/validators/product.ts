import type { AppIconName } from "@/types/icons";
import type { CategoryId } from "@/types";

const CATEGORY_IDS: CategoryId[] = [
  "refeicoes",
  "batatas",
  "bebidas",
  "sobremesas",
];

export type ProductInput = {
  categoryId?: unknown;
  name?: unknown;
  description?: unknown;
  price?: unknown;
  icon?: unknown;
  imageUrl?: unknown;
  active?: unknown;
};

export function isCategoryId(value: unknown): value is CategoryId {
  return (
    typeof value === "string" &&
    CATEGORY_IDS.includes(value as CategoryId)
  );
}

export function parseProductCreateBody(body: ProductInput) {
  const errors: string[] = [];

  if (!isCategoryId(body.categoryId)) {
    errors.push("Categoria inválida.");
  }

  const name = String(body.name ?? "").trim();
  if (!name) errors.push("Nome do prato é obrigatório.");

  const description = String(body.description ?? "").trim();

  const priceRaw = body.price;
  const price =
    typeof priceRaw === "string"
      ? Number(priceRaw.replace(",", "."))
      : Number(priceRaw);

  if (!Number.isFinite(price) || price <= 0) {
    errors.push("Preço inválido.");
  }

  const icon =
    typeof body.icon === "string" && body.icon.trim()
      ? (body.icon as AppIconName)
      : undefined;

  if (errors.length > 0) {
    return { ok: false as const, errors };
  }

  return {
    ok: true as const,
    data: {
      categoryId: body.categoryId as CategoryId,
      name,
      description,
      price,
      icon,
    },
  };
}

export function parseProductUpdateBody(body: ProductInput) {
  const errors: string[] = [];
  const data: {
    categoryId?: CategoryId;
    name?: string;
    description?: string;
    price?: number;
    icon?: AppIconName;
    imageUrl?: string | null;
    active?: boolean;
  } = {};

  if (body.categoryId !== undefined) {
    if (!isCategoryId(body.categoryId)) errors.push("Categoria inválida.");
    else data.categoryId = body.categoryId;
  }

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) errors.push("Nome do prato é obrigatório.");
    else data.name = name;
  }

  if (body.description !== undefined) {
    data.description = String(body.description).trim();
  }

  if (body.price !== undefined) {
    const price =
      typeof body.price === "string"
        ? Number(String(body.price).replace(",", "."))
        : Number(body.price);
    if (!Number.isFinite(price) || price <= 0) errors.push("Preço inválido.");
    else data.price = price;
  }

  if (body.icon !== undefined && typeof body.icon === "string") {
    data.icon = body.icon as AppIconName;
  }

  if (body.imageUrl !== undefined) {
    if (body.imageUrl === null || body.imageUrl === "") {
      data.imageUrl = null;
    } else if (typeof body.imageUrl === "string" && body.imageUrl.trim()) {
      data.imageUrl = body.imageUrl.trim();
    }
  }

  if (errors.length > 0) {
    return { ok: false as const, errors };
  }

  return { ok: true as const, data };
}
