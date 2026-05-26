import Image from "next/image";
import { cn } from "@/lib/utils";

// Official Pulse logo lives at /public/logo.png.
// Intrinsic dimensions roughly match the artwork (square-ish composition).
// Sizing is driven by the className — `h-* w-auto` preserves aspect ratio.
export default function Logo({
  className,
  src = "/logo.png",
  alt = "Pulse",
}: {
  className?: string;
  src?: string;
  alt?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={360}
      height={400}
      priority
      sizes="(min-width: 768px) 64px, 48px"
      className={cn("h-auto w-auto", className)}
    />
  );
}
