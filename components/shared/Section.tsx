import { cn } from "@/lib/utils";

export default function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={cn("py-20 md:py-32", className)}>{children}</section>;
}
