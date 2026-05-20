import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "block w-full border border-ink/20 bg-transparent p-3 text-base outline-none transition-colors focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}
