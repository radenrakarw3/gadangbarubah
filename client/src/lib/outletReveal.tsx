import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const LazyOurOutletSection = lazy(() => import("@/components/home/OurOutletSection"));

/** Tinggi grid outlet desktop (4 kolom) — selaras dengan catering & laptop/MacBook */
export const DESKTOP_OUTLET_MIN_H = "xl:min-h-[640px]";

type OutletRevealContextValue = {
  visible: boolean;
  /** Toggle section outlet — buka + scroll, atau tutup */
  reveal: () => void;
};

const OutletRevealContext = createContext<OutletRevealContextValue | null>(null);

function useOutletRevealContext() {
  const ctx = useContext(OutletRevealContext);
  if (!ctx) {
    throw new Error("OutletReveal components must be used within OutletRevealProvider");
  }
  return ctx;
}

/** Panggil dari tombol "Outlet Kami" — toggle section outlet */
export function useRevealOutlet() {
  return useOutletRevealContext().reveal;
}

export function useOutletVisible() {
  return useOutletRevealContext().visible;
}

function OutletPlaceholder() {
  return <div className={cn("min-h-[420px] w-full bg-[#300505]", DESKTOP_OUTLET_MIN_H)} aria-hidden />;
}

export function OutletSectionSlot() {
  const { visible } = useOutletRevealContext();

  if (!visible) return null;

  return (
    <div id="outlet-section" className="scroll-mt-16 sm:scroll-mt-24">
      <Suspense fallback={<OutletPlaceholder />}>
        <LazyOurOutletSection />
      </Suspense>
    </div>
  );
}

export function OutletRevealProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(false);

  const scrollToOutlet = useCallback(() => {
    document.getElementById("outlet-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const reveal = useCallback(() => {
    if (!visible) {
      setVisible(true);
      setPendingScroll(true);
      return;
    }
    setVisible(false);
    document.getElementById("about-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [visible]);

  useEffect(() => {
    if (!pendingScroll || !visible) return;

    const timer = window.setTimeout(() => {
      scrollToOutlet();
      setPendingScroll(false);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pendingScroll, visible, scrollToOutlet]);

  return (
    <OutletRevealContext.Provider value={{ visible, reveal }}>
      {children}
    </OutletRevealContext.Provider>
  );
}
