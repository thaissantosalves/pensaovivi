import type { CategoryId, Product } from "@/types";

export function getProductsByCategory(
  products: Product[],
  categoryId: CategoryId
): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}
