import Image from "next/image";
import { cn } from "@/lib/utils";

// Default ships the SVG placeholder. Drop the official PNG at /public/logo.png
// and set `src="/logo.png"` (or update this default) to swap globally.
export default function Logo({
  className,
  src = "/logo.svg",
  alt = "Pulse",
  size = 28,
}: {
  className?: string;
  src?: string;
  alt?: string;
  size?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority
      className={cn("h-7 w-auto", className)}
    />
  );
}
