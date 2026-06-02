import { Suspense } from "react";
import { Link } from "wouter";
import { lazyRetry } from "@/lib/lazyRetry";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const QuickReservationBar = lazyRetry(() => import("./QuickReservationBar"));

function ReservationSkeleton() {
  return (
    <div
      className="h-10 w-full animate-pulse rounded-lg bg-white/10 sm:h-11 md:h-[52px] xl:h-[60px]"
      aria-hidden
    />
  );
}

interface HeroReservationSlotProps {
  className?: string;
}

export default function HeroReservationSlot({ className }: HeroReservationSlotProps) {
  const { lang } = useSiteLanguage();

  return (
    <div className={cn("w-full", className)}>
      <Suspense
        fallback={
          <div className="flex flex-col gap-2">
            <ReservationSkeleton />
            <Link
              href="/reservasi"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[rgba(89,0,0,0.92)] font-heroCta text-sm font-bold italic tracking-[0.03em] text-[#F0E6E6] hover:bg-[#6a0000] sm:hidden"
            >
              {lang === "ID" ? "Reservasi Sekarang" : "Reserve Now"}
            </Link>
          </div>
        }
      >
        <QuickReservationBar />
      </Suspense>
    </div>
  );
}
