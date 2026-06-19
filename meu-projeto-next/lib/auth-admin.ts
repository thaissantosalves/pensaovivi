import bcrypt from "bcryptjs";
import { ensureAdminSeeded } from "@/lib/seed-supabase";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SessionUser } from "@/lib/auth-session";

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<SessionUser | null> {
  await ensureAdminSeeded();

  const supabase = createAdminClient();
  const { data: row, error } = await supabase
    .from("admin_users")
    .select("id, email, password_hash, name")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!row) return null;

  const valid = bcrypt.compareSync(password, row.password_hash);
  if (!valid) return null;

  return {
    id: typeof row.id === "string" ? parseInt(row.id, 10) : row.id,
    email: row.email,
    name: row.name,
  };
}
