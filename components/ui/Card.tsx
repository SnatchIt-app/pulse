import { cn } from "@/lib/utils";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("border border-ink/10 bg-paper p-6", className)}>{children}</div>;
}
