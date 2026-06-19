import AdminProductForm from "@/components/admin-product-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditarPage({ params }: PageProps) {
  const { id } = await params;

  return <AdminProductForm mode="edit" productId={id} />;
}
