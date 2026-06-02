import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";

type LazyModule = { default: ComponentType };

interface LazyWhenVisibleProps {
  load: () => Promise<LazyModule>;
  /** Ruang minimal sebelum section dimuat (cegah layout shift). */
  minHeight?: string;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

function SectionPlaceholder({ minHeight }: { minHeight: string }) {
  return (
    <div
      className="w-full bg-[#300505]"
      style={{ minHeight }}
      aria-hidden
    />
  );
}

/**
 * Muat chunk React + render komponen saat placeholder mendekati viewport.
 */
export default function LazyWhenVisible({
  load,
  minHeight = "360px",
  rootMargin = "280px 0px",
  fallback,
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const LazySection = useMemo(() => lazy(load), [load]);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense
          fallback={
            fallback ?? <SectionPlaceholder minHeight={minHeight} />
          }
        >
          <LazySection />
        </Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
}
