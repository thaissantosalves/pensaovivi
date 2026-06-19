import { jsonOk } from "@/lib/api-response";
import { categories } from "@/lib/menu-data";

export const runtime = "nodejs";

export async function GET() {
  return jsonOk({ categories });
}
