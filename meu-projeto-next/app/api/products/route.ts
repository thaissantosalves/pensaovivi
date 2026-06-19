import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-session";
import { jsonError, jsonErrors, jsonOk } from "@/lib/api-response";
import {
  createProduct,
  listActiveProducts,
  listAllProducts,
} from "@/lib/products-service";
import {
  isCategoryId,
  parseProductCreateBody,
} from "@/lib/validators/product";
import type { CategoryId } from "@/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const categoryParam = searchParams.get("category");
    const categoryId = isCategoryId(categoryParam)
      ? (categoryParam as CategoryId)
      : undefined;

    if (all) {
      const user = await getSessionUser();
      if (!user) {
        return jsonError("Não autorizado.", 401);
      }
      return jsonOk({ products: await listAllProducts(categoryId) });
    }

    return jsonOk({ products: await listActiveProducts(categoryId) });
  } catch {
    return jsonError("Erro ao buscar produtos.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return jsonError("Não autorizado.", 401);
    }

    const body = await request.json();
    const parsed = parseProductCreateBody(body);

    if (!parsed.ok) {
      return jsonErrors(parsed.errors, 400);
    }

    const product = await createProduct(parsed.data);
    return jsonOk({ product }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao criar produto.";
    return jsonError(message, 400);
  }
}
