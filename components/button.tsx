import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 focus:ring-offset-paper float-on-hover glow-edges";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary: "bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-black",
    secondary: "bg-olive text-paper shadow-soft hover:-translate-y-0.5 hover:bg-[#556146]",
    ghost:
      "border border-stone/40 bg-white/60 text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:bg-white",
  }[variant];

  return (
    <Link className={cn(base, styles, className)} href={href}>
      {children}
    </Link>
  );
}

export function Button({
  type = "button",
  disabled = false,
  onClick,
  children,
  variant = "primary",
  className,
}: {
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary: "bg-ink text-paper shadow-soft hover:-translate-y-0.5 hover:bg-black",
    secondary: "bg-olive text-paper shadow-soft hover:-translate-y-0.5 hover:bg-[#556146]",
    ghost:
      "border border-stone/40 bg-white/60 text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:bg-white",
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, styles, "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0", className)}
    >
      {children}
    </button>
  );
}
