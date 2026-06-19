import { getSessionUser } from "@/lib/auth-session";
import { jsonError, jsonErrors, jsonOk } from "@/lib/api-response";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products-service";
import { parseProductUpdateBody } from "@/lib/validators/product";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return jsonError("Produto não encontrado.", 404);
    }
    return jsonOk({ product });
  } catch {
    return jsonError("Erro ao buscar produto.", 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return jsonError("Não autorizado.", 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = parseProductUpdateBody(body);

    if (!parsed.ok) {
      return jsonErrors(parsed.errors, 400);
    }

    const product = await updateProduct(id, parsed.data);

    if (!product) {
      return jsonError("Produto não encontrado.", 404);
    }

    return jsonOk({ product });
  } catch {
    return jsonError("Erro ao atualizar produto.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return jsonError("Não autorizado.", 401);
    }

    const { id } = await context.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return jsonError("Produto não encontrado.", 404);
    }

    return jsonOk({ ok: true });
  } catch {
    return jsonError("Erro ao excluir produto.", 500);
  }
}
