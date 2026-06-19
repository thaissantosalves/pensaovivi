import { NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth-session";
import { authenticateAdmin } from "@/lib/auth-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await authenticateAdmin(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Erro ao fazer login." },
      { status: 500 }
    );
  }
}
