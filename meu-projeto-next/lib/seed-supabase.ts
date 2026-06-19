import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";

let adminSeedPromise: Promise<void> | null = null;

async function seedAdminIfNeeded() {
  const supabase = createAdminClient();

  const { count: adminCount, error: adminCountError } = await supabase
    .from("admin_users")
    .select("*", { count: "exact", head: true });

  if (adminCountError) {
    throw new Error(`Erro ao verificar admins: ${adminCountError.message}`);
  }

  if ((adminCount ?? 0) === 0) {
    const email = process.env.ADMIN_EMAIL ?? "admin@pensaovivi.com";
    const password = process.env.ADMIN_PASSWORD ?? "vivi2024";
    const hash = bcrypt.hashSync(password, 10);

    const { error: adminError } = await supabase.from("admin_users").insert({
      email,
      password_hash: hash,
      name: "Pensão da Vivi",
    });

    if (adminError) {
      throw new Error(`Erro ao inserir admin inicial: ${adminError.message}`);
    }
  }
}

export function ensureAdminSeeded() {
  if (!adminSeedPromise) {
    adminSeedPromise = seedAdminIfNeeded().catch((error) => {
      adminSeedPromise = null;
      throw error;
    });
  }
  return adminSeedPromise;
}
