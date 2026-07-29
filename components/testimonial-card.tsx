export function TestimonialCard({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <figure className="rounded-3xl border border-stone/25 bg-white p-6 shadow-soft">
      <blockquote className="text-base leading-7 text-ink/80">"{quote}"</blockquote>
      <figcaption className="mt-4 text-sm font-medium text-earth">{author}</figcaption>
    </figure>
  );
}
