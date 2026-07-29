"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, { error: "" });

  useEffect(() => {
    if (state?.success) {
      router.push("/admin");
    }
  }, [state?.success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f3eb] px-4">
      <div className="w-full max-w-sm space-y-6 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-earth">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">3 Amici Suites</h1>
          <p className="mt-3 text-sm leading-6 text-ink/68">
            Inserisci la password per accedere al pannello di gestione dei calendari Booking.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="password" className="text-[12px] uppercase tracking-[0.22em] text-earth">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              placeholder="••••••••"
              className="h-12 rounded-2xl border border-stone/20 bg-paper/70 px-4 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-olive focus:bg-white"
            />
          </div>

          {state?.error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-[#9b463d]">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/50">
          <a href="/3-amici-suites/" className="hover:text-ink">
            Torna al sito
          </a>
        </p>
      </div>
    </div>
  );
}
