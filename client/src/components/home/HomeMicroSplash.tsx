import { useCallback, useEffect, useRef, useState } from "react";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";

export const SPLASH_MAX_MS = 500;
const FADE_MS = 150;

interface HomeMicroSplashProps {
  visible: boolean;
  exiting?: boolean;
}

export function useMicroSplash(onDismiss?: () => void) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, FADE_MS);
  }, [onDismiss]);

  useEffect(() => {
    const cap = window.setTimeout(dismiss, SPLASH_MAX_MS);

    if (document.readyState === "complete") {
      const early = window.setTimeout(dismiss, 280);
      return () => {
        window.clearTimeout(cap);
        window.clearTimeout(early);
      };
    }

    const onReady = () => {
      window.setTimeout(dismiss, 280);
    };
    window.addEventListener("load", onReady, { once: true });

    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("load", onReady);
    };
  }, [dismiss]);

  return { visible, exiting, dismiss };
}

export default function HomeMicroSplash({ visible, exiting = false }: HomeMicroSplashProps) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#300505] transition-opacity duration-150 ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Memuat"
    >
      <img
        src={logoImage}
        alt="Gadang Barubah"
        className="h-14 w-auto object-contain brightness-110 sm:h-16"
        width={160}
        height={80}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}
