"use client";

import { useEffect, useState, useCallback } from "react";

type FeedRoom = {
  roomSlug: string;
  roomName: string;
  icalUrl: string;
};

type FeedProperty = {
  propertySlug: string;
  propertyName: string;
  bookingUrl: string | null;
  rooms: FeedRoom[];
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function AdminPanel() {
  const [properties, setProperties] = useState<FeedProperty[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [testingRoom, setTestingRoom] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; message: string }>>({});
  const [testingAll, setTestingAll] = useState(false);
  const [globalHealth, setGlobalHealth] = useState<{ valid: number; total: number } | null>(null);

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/3-amici-suites/api/admin/feeds/");
      if (!res.ok) throw new Error("Non autorizzato");
      const data = await res.json();
      setProperties(data.feeds);
      const initialUrls: Record<string, string> = {};
      for (const prop of data.feeds) {
        for (const room of prop.rooms) {
          initialUrls[room.roomSlug] = room.icalUrl;
        }
      }
      setUrls(initialUrls);
    } catch {
      // Will redirect to login
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  async function handleSave() {
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/3-amici-suites/api/admin/feeds/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urls),
      });
      const data = await res.json();
      if (!res.ok) {
        setSave({ kind: "error", message: data.message || "Errore durante il salvataggio" });
      } else {
        setSave({ kind: "success", message: data.message });
        // Reload to show updated state
        loadFeeds();
      }
    } catch {
      setSave({ kind: "error", message: "Errore di rete. Riprova." });
    }
  }

  async function handleTest(roomSlug: string) {
    setTestingRoom(roomSlug);
    try {
      const res = await fetch("/3-amici-suites/api/admin/test-ical/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urls[roomSlug] }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [roomSlug]: { ok: data.ok, message: data.message },
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [roomSlug]: { ok: false, message: "Errore di rete durante il test." },
      }));
    } finally {
      setTestingRoom(null);
    }
  }

  async function handleReload() {
    setSave({ kind: "idle" });
    setTestResults({});
    setGlobalHealth(null);
    loadFeeds();
  }

  async function handleTestAll() {
    setTestingAll(true);
    setGlobalHealth(null);
    try {
      const res = await fetch("/3-amici-suites/api/admin/feeds-health/");
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      setGlobalHealth({ valid: data.valid, total: data.total });
      // Also update individual test results
      const newResults: Record<string, { ok: boolean; message: string }> = {};
      for (const feed of data.feeds) {
        newResults[feed.roomSlug] = { ok: feed.ok, message: feed.message };
      }
      setTestResults(newResults);
    } catch {
      setGlobalHealth({ valid: 0, total: 0 });
    } finally {
      setTestingAll(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-stone/20" />
        <div className="h-48 rounded-[1.6rem] bg-stone/10" />
      </div>
    );
  }

  const changedCount = Object.entries(urls).filter(
    ([slug, url]) => url !== properties.flatMap((p) => p.rooms).find((r) => r.roomSlug === slug)?.icalUrl,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-earth">Gestione calendari</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Link iCal Booking</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/68">
          Quando Booking.com invalida i token, riceverai un'email automatica. Da qui puoi aggiornare i link
          senza toccare il codice. Dopo il salvataggio, riavvia il server per applicare le modifiche.
        </p>

        {/* Global health check */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleTestAll}
            disabled={testingAll}
            className="inline-flex items-center gap-2 rounded-full border border-stone/25 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {testingAll ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                Verifica in corso...
              </>
            ) : (
              "🔍 Verifica tutti i link"
            )}
          </button>

          {globalHealth && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                globalHealth.valid === globalHealth.total
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : globalHealth.valid > 0
                    ? "border-amber-200 bg-amber-50 text-[#9b6a2f]"
                    : "border-rose-200 bg-rose-50 text-[#9b463d]"
              }`}
            >
              {globalHealth.valid}/{globalHealth.total} funzionanti
              {globalHealth.valid === 0 && " — il checker è disattivato sul sito"}
              {globalHealth.valid === globalHealth.total && " — il checker è attivo sul sito"}
            </span>
          )}
        </div>
      </div>

      {save.kind === "success" ? (
        <div className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <p className="font-medium">✅ {save.message}</p>
          <p className="mt-2 text-emerald-700">
            Per applicare le modifiche al sito pubblico, riavvia il server.
          </p>
          <button
            onClick={handleReload}
            className="mt-3 rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          >
            OK, ho capito
          </button>
        </div>
      ) : save.kind === "error" ? (
        <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-5 text-sm text-[#9b463d]">
          ❌ {save.message}
        </div>
      ) : null}

      <div className="space-y-6">
        {properties.map((property) => (
          <section
            key={property.propertySlug}
            className="overflow-hidden rounded-[1.8rem] border border-stone/15 bg-white shadow-soft"
          >
            <div className="border-b border-stone/12 bg-gradient-to-b from-white to-[#f8f2e9] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-earth">{property.propertySlug}</p>
                  <h2 className="mt-1 text-lg font-medium text-ink">{property.propertyName}</h2>
                </div>
                {property.bookingUrl ? (
                  <a
                    href={property.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-stone/20 bg-white/80 px-3 py-1.5 text-[11px] text-olive hover:bg-white"
                  >
                    Booking →
                  </a>
                ) : null}
              </div>
            </div>

            <div className="divide-y divide-stone/8">
              {property.rooms.map((room) => {
                const original = properties
                  .flatMap((p) => p.rooms)
                  .find((r) => r.roomSlug === room.roomSlug)?.icalUrl;
                const changed = urls[room.roomSlug] !== original;
                const testResult = testResults[room.roomSlug];
                const isTesting = testingRoom === room.roomSlug;

                return (
                  <div key={room.roomSlug} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{room.roomName}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-earth">{room.roomSlug}</p>
                      </div>
                      {changed ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-[#9b6a2f]">
                          Modificato
                        </span>
                      ) : null}
                      {testResult ? (
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                            testResult.ok
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-rose-200 bg-rose-50 text-[#9b463d]"
                          }`}
                        >
                          {testResult.ok ? "Funziona ✓" : "Errore ✗"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <input
                        type="text"
                        value={urls[room.roomSlug] ?? ""}
                        onChange={(e) =>
                          setUrls((prev) => ({ ...prev, [room.roomSlug]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-stone/20 bg-paper/60 px-3 py-2 text-[13px] text-ink outline-none transition font-mono placeholder:text-ink/30 focus:border-olive focus:bg-white"
                        placeholder="https://ical.booking.com/v1/export/t/..."
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleTest(room.roomSlug)}
                        disabled={isTesting || !urls[room.roomSlug]}
                        className="rounded-full border border-stone/20 bg-white px-3 py-1.5 text-[11px] font-medium text-ink/70 hover:bg-stone/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isTesting ? "Test in corso..." : "Test link"}
                      </button>
                      {original && urls[room.roomSlug] !== original ? (
                        <button
                          onClick={() =>
                            setUrls((prev) => ({ ...prev, [room.roomSlug]: original }))
                          }
                          className="rounded-full border border-stone/20 bg-white px-3 py-1.5 text-[11px] font-medium text-ink/50 hover:text-ink/70"
                        >
                          Ripristina originale
                        </button>
                      ) : null}
                    </div>
                    {testResult ? (
                      <p
                        className={`mt-2 text-[11px] ${testResult.ok ? "text-emerald-700" : "text-[#9b463d]"}`}
                      >
                        {testResult.message}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 rounded-[1.6rem] border border-stone/15 bg-white p-4 shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink">
              {changedCount > 0
                ? `${changedCount} link modificati — pronto per il salvataggio`
                : "Nessuna modifica in sospeso"}
            </p>
            <p className="mt-1 text-xs text-ink/50">
              Dopo il salvataggio, riavvia il server per applicare le modifiche.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={save.kind === "saving" || changedCount === 0}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {save.kind === "saving" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
                Salvataggio...
              </>
            ) : (
              `Salva (${changedCount})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
