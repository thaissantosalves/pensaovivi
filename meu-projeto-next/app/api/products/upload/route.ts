import { getSessionUser } from "@/lib/auth-session";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getProductById, updateProduct } from "@/lib/products-service";
import {
  deleteProductImage,
  uploadProductImage,
} from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return jsonError("Não autorizado.", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const productId = String(formData.get("productId") ?? "").trim();

    if (!productId) {
      return jsonError("ID do produto é obrigatório.", 400);
    }

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Selecione uma imagem.", 400);
    }

    const product = await getProductById(productId);
    if (!product) {
      return jsonError("Produto não encontrado.", 404);
    }

    const imageUrl = await uploadProductImage(productId, file);

    if (product.imageUrl) {
      await deleteProductImage(product.imageUrl).catch(() => undefined);
    }

    const updated = await updateProduct(productId, { imageUrl });
    if (!updated) {
      return jsonError("Erro ao salvar imagem.", 500);
    }

    return jsonOk({ imageUrl, product: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao enviar imagem.";
    return jsonError(message, 400);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return jsonError("Não autorizado.", 401);
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId")?.trim();

    if (!productId) {
      return jsonError("ID do produto é obrigatório.", 400);
    }

    const product = await getProductById(productId);
    if (!product) {
      return jsonError("Produto não encontrado.", 404);
    }

    if (product.imageUrl) {
      await deleteProductImage(product.imageUrl).catch(() => undefined);
    }

    const updated = await updateProduct(productId, { imageUrl: null });
    if (!updated) {
      return jsonError("Erro ao remover imagem.", 500);
    }

    return jsonOk({ product: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao remover imagem.";
    return jsonError(message, 400);
  }
}
