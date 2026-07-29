import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "Admin | 3 Amici Suites",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword || token !== envPassword) {
    redirect("/3-amici-suites/admin/login/");
  }

  return (
    <div className="min-h-screen bg-[#f8f3eb]">
      <header className="border-b border-stone/20 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-serif text-xl text-ink">
              Admin Panel
            </Link>
            <span className="rounded-full bg-olive/10 px-3 py-0.5 text-[11px] uppercase tracking-[0.2em] text-olive">
              3 Amici Suites
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ink/60 hover:text-ink">
              Vai al sito
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
