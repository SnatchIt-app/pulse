import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:opacity-90",
  ghost: "border border-ink/30 text-ink hover:bg-ink hover:text-paper",
  link: "underline underline-offset-4 hover:opacity-70",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center uppercase tracking-[0.16em] transition-colors duration-pulse ease-pulse",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
