import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "border-ink/20 block w-full border bg-transparent p-3 text-base outline-none transition-colors focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}
