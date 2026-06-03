import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PrivacyConsentFieldProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  lang: "ID" | "EN";
  id?: string;
  className?: string;
  /** Untuk form hero di atas foto gelap */
  variant?: "dark" | "light";
}

export default function PrivacyConsentField({
  checked,
  onCheckedChange,
  lang,
  id = "privacy-consent",
  className,
  variant = "light",
}: PrivacyConsentFieldProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className={cn(
          "mt-0.5 shrink-0 border-white/40 data-[state=checked]:bg-[rgba(89,0,0,0.95)] data-[state=checked]:border-[rgba(89,0,0,0.95)]",
          !isDark && "border-[#3F0000]/30 data-[state=checked]:bg-[#3F0000] data-[state=checked]:border-[#3F0000]",
        )}
        aria-required
      />
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer font-[var(--font-form)] text-xs leading-snug sm:text-[13px]",
          isDark ? "text-[#D2D2D2]/90" : "text-[#5c4040]/90",
        )}
      >
        {lang === "ID" ? (
          <>
            Saya setuju dengan{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:opacity-80">
              Syarat &amp; Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:opacity-80">
              Kebijakan Privasi
            </Link>
            .
          </>
        ) : (
          <>
            I agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:opacity-80">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </>
        )}
      </label>
    </div>
  );
}
