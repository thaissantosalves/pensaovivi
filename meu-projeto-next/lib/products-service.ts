import { categories } from "@/lib/menu-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteProductImage } from "@/lib/storage";
import type { AppIconName } from "@/types/icons";
import type { CategoryId, Product } from "@/types";

type ProductRow = {
  id: string;
  category_id: CategoryId;
  name: string;
  description: string;
  price: number | string;
  icon: AppIconName;
  image_url: string | null;
  active: boolean;
};

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
    icon: row.icon,
    imageUrl: row.image_url ?? null,
    active: row.active,
  };
}

export async function listProducts(
  options: {
    categoryId?: CategoryId;
    activeOnly?: boolean;
  } = {}
): Promise<Product[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select("id, category_id, name, description, price, icon, image_url, active")
    .order("name", { ascending: true });

  if (options.activeOnly) {
    query = query.eq("active", true);
  }

  if (options.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProductRow[]).map(mapRow);
}

export async function listActiveProducts(
  categoryId?: CategoryId
): Promise<Product[]> {
  return listProducts({ categoryId, activeOnly: true });
}

export async function listAllProducts(
  categoryId?: CategoryId
): Promise<Product[]> {
  return listProducts({ categoryId, activeOnly: false });
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, category_id, name, description, price, icon, image_url, active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRow(data as ProductRow) : null;
}

export type CreateProductInput = {
  id?: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  price: number;
  icon?: AppIconName;
  imageUrl?: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  active?: boolean;
};

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defaultIconForCategory(categoryId: CategoryId): AppIconName {
  return categories.find((c) => c.id === categoryId)?.icon ?? "restaurant";
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const id = input.id?.trim() || slugify(input.name);
  const existing = await getProductById(id);
  if (existing) {
    throw new Error("Já existe um prato com este nome. Tente outro nome.");
  }

  const icon = input.icon ?? defaultIconForCategory(input.categoryId);
  const supabase = createAdminClient();

  const { error } = await supabase.from("products").insert({
    id,
    category_id: input.categoryId,
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    icon,
    image_url: input.imageUrl ?? null,
    active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const product = await getProductById(id);
  if (!product) {
    throw new Error("Erro ao criar produto.");
  }

  return product;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product | null> {
  const current = await getProductById(id);
  if (!current) return null;

  const nextImageUrl =
    input.imageUrl !== undefined ? input.imageUrl : current.imageUrl;

  if (
    input.imageUrl !== undefined &&
    input.imageUrl !== current.imageUrl &&
    current.imageUrl
  ) {
    await deleteProductImage(current.imageUrl).catch(() => undefined);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      category_id: input.categoryId ?? current.categoryId,
      name: (input.name ?? current.name).trim(),
      description: (input.description ?? current.description).trim(),
      price: input.price ?? current.price,
      icon: input.icon ?? current.icon,
      image_url: nextImageUrl ?? null,
      active: input.active !== undefined ? input.active : current.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}
