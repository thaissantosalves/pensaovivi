import { Suspense } from "react";
import AdminLoginPage from "./page.client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
          Carregando...
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
