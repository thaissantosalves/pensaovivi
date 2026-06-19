import AdminProductForm from "@/components/admin-product-form";
import { categories } from "@/lib/menu-data";
import type { CategoryId } from "@/types";

type PageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

const validCategories = new Set(categories.map((c) => c.id));

function parseCategory(value?: string): CategoryId {
  if (value && validCategories.has(value as CategoryId)) {
    return value as CategoryId;
  }
  return "refeicoes";
}

export default async function AdminNovoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialCategory = parseCategory(params.categoria);

  return (
    <AdminProductForm mode="create" initialCategory={initialCategory} />
  );
}
