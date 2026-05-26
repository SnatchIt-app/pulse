import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border-ink/30 block w-full border-b bg-transparent py-2 text-base outline-none transition-colors focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}
