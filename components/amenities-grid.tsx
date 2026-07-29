export function AmenitiesGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-stone/20 bg-white/80 px-4 py-4 text-sm text-ink shadow-sm"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
