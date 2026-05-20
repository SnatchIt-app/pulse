import { cn } from "@/lib/utils";

export default function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-ink/30 px-2 py-0.5 text-xs uppercase tracking-[0.16em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
