import Image from "next/image";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";

export function ImageFrame({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.9rem] bg-sand/50 shadow-soft ring-1 ring-white/50",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_35%)] opacity-80" />
      <Image
        src={withBasePath(src)}
        alt={alt}
        width={1200}
        height={900}
        priority={priority}
        sizes={sizes}
        className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">
        <div className="animate-sheen absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-sm" />
      </div>
    </div>
  );
}
