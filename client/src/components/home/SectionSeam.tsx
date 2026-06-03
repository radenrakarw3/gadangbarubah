import { cn } from "@/lib/utils";

/** Gradasi antar section — nuansa maroon, tanpa flash putih (mobile only) */
const SEAM_GRADIENTS = {
  "maroon-to-cream":
    "linear-gradient(180deg, #300505 0%, #3a0808 18%, #4a1010 36%, #5c1818 54%, #7a2e2e 72%, #a85850 88%, #e8dcd6 100%)",
  "cream-to-maroon":
    "linear-gradient(180deg, #f5ebe6 0%, #a85850 12%, #7a2e2e 30%, #5c1818 48%, #4a1010 66%, #3a0808 84%, #300505 100%)",
  "maroon-to-inquiry":
    "linear-gradient(180deg, #300505 0%, #3f0a0a 22%, #521212 44%, #6b2424 66%, #8f4a42 84%, #FFFCF8 100%)",
  "inquiry-to-contact":
    "linear-gradient(180deg, #FFFCF8 0%, #ead9cf 40%, #e0cfc5 70%, #f3efe8 100%)",
  "contact-to-footer":
    "linear-gradient(180deg, #DBDBDB 0%, #e8ddd6 45%, #efe8e3 75%, #f7f4f2 100%)",
} as const;

export type SectionSeamVariant = keyof typeof SEAM_GRADIENTS;

export default function SectionSeam({
  variant,
  className,
}: {
  variant: SectionSeamVariant;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none h-12 w-full shrink-0 sm:h-14 lg:hidden",
        className,
      )}
      style={{ background: SEAM_GRADIENTS[variant] }}
    />
  );
}
