import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazyWhenVisibleProps {
  children: ReactNode;
  /** Placeholder tipis sebelum section masuk viewport */
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}

function DefaultFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-20 animate-pulse bg-white/5", className)}
      aria-hidden
    />
  );
}

export function useInView(options?: { rootMargin?: string; triggerOnce?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const rootMargin = options?.rootMargin ?? "200px 0px";
  const triggerOnce = options?.triggerOnce ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (triggerOnce) observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, triggerOnce]);

  return { ref, visible };
}

export default function LazyWhenVisible({
  children,
  fallback,
  className,
  rootMargin = "200px 0px",
}: LazyWhenVisibleProps) {
  const { ref, visible } = useInView({ rootMargin, triggerOnce: true });

  return (
    <div ref={ref} className={className}>
      {visible ? children : (fallback ?? <DefaultFallback />)}
    </div>
  );
}
