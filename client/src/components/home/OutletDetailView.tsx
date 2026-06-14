import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { HOME_OUTLET_PANELS } from "@/lib/siteContent";
import { DESKTOP_OUTLET_MIN_H } from "@/lib/outletReveal";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import cikarangImg from "@assets/outlet-cikarang-1_1781246285353.jpg";
import cikarangGallery2 from "@assets/outlet-cikarang-2_1781246285353.jpg";
import cikarangGallery3 from "@assets/outlet-cikarang-3_1781246285353.jpg";
import cikarangGallery4 from "@assets/outlet-cikarang-4_1781246285353.jpg";
import bintaroImg from "@assets/outlet-bintaro-1_1781246285353.jpg";
import bintaroGallery2 from "@assets/outlet-bintaro-2_1781246285353.jpg";
import bintaroGallery3 from "@assets/outlet-bintaro-3_1781246285353.jpg";
import bintaroGallery4 from "@assets/outlet-bintaro-4_1781246285353.jpg";
import bintaroGallery5 from "@assets/outlet-bintaro-5_1781246285353.jpg";
import bintaroGallery6 from "@assets/outlet-bintaro-6_1781246285353.jpg";

const AUTO_SLIDE_MS = 4500;
const AUTO_PAUSE_AFTER_MANUAL_MS = 9000;

type OutletSlide = { src: string; objectPosition?: string };

const OUTLET_GALLERIES: Record<"cikarang" | "bintaro", readonly OutletSlide[]> = {
  cikarang: [
    { src: cikarangImg, objectPosition: "center center" },
    { src: cikarangGallery2, objectPosition: "center center" },
    { src: cikarangGallery3, objectPosition: "center 35%" },
    { src: cikarangGallery4, objectPosition: "center 55%" },
  ],
  bintaro: [
    { src: bintaroImg, objectPosition: "center center" },
    { src: bintaroGallery2, objectPosition: "center center" },
    { src: bintaroGallery3, objectPosition: "center 42%" },
    { src: bintaroGallery4, objectPosition: "center center" },
    { src: bintaroGallery5, objectPosition: "center center" },
    { src: bintaroGallery6, objectPosition: "center 38%" },
  ],
};

type OpenPanel = Extract<(typeof HOME_OUTLET_PANELS)[number], { status: "open" }>;

export type OutletOriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const EXPAND_MS = 1100;
const COLLAPSE_MS = 950;
const CONTENT_MS = 580;
const CONTENT_DELAY_MS = 720;
const EXIT_MS = 280;
const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
const EASE_OUT = "cubic-bezier(0.4, 0, 0.2, 1)";

function tileToContainerTransform(
  origin: OutletOriginRect,
  containerWidth: number,
  containerHeight: number,
): string {
  const sx = origin.width / containerWidth;
  const sy = origin.height / containerHeight;
  return `translate3d(${origin.left}px, ${origin.top}px, 0) scale(${sx}, ${sy})`;
}

function OutletPhotoCarousel({
  images,
  expanded,
  contentVisible,
  lang,
}: {
  images: readonly OutletSlide[];
  expanded: boolean;
  contentVisible: boolean;
  lang: "ID" | "EN";
}) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, AUTO_PAUSE_AFTER_MANUAL_MS);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || !contentVisible) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [contentVisible, images]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    },
    [],
  );

  const go = (direction: -1 | 1) => {
    pauseAuto();
    setIndex((current) => (current + direction + images.length) % images.length);
  };

  const prevLabel = lang === "ID" ? "Foto sebelumnya" : "Previous photo";
  const nextLabel = lang === "ID" ? "Foto berikutnya" : "Next photo";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <div
        className="flex h-full will-change-transform"
        style={{
          width: `${images.length * 100}%`,
          transform: `translate3d(-${(index / images.length) * 100}%, 0, 0)`,
          transition: `transform 720ms ${EASE}`,
        }}
        aria-live="polite"
      >
        {images.map((slide) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className="h-full flex-shrink-0 object-cover"
            style={{
              width: `${100 / images.length}%`,
              objectPosition: slide.objectPosition ?? "center center",
              transform: expanded ? "scale(1)" : "scale(1.08)",
              transition: `transform ${EXPAND_MS}ms ${EASE}`,
            }}
            draggable={false}
          />
        ))}
      </div>

      {images.length > 1 && contentVisible ? (
        <div
          className="absolute bottom-[clamp(5.5rem,18vh,9rem)] left-1/2 z-[5] flex -translate-x-1/2 items-center gap-3 sm:bottom-[clamp(6rem,20vh,10rem)] sm:gap-4"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: `opacity ${CONTENT_MS}ms ${EASE}`,
          }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:h-10 sm:w-10"
            aria-label={prevLabel}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2">
            {images.map((slide, dotIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => {
                  pauseAuto();
                  setIndex(dotIndex);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  dotIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70",
                )}
                aria-label={`${lang === "ID" ? "Foto" : "Photo"} ${dotIndex + 1}`}
                aria-current={dotIndex === index}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:h-10 sm:w-10"
            aria-label={nextLabel}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function InfoBlock({
  title,
  lines,
  className,
  style,
}: {
  title: string;
  lines: readonly string[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("font-heroCta text-white", className)} style={style}>
      <h3 className="text-base font-semibold leading-snug tracking-[0.01em] sm:text-lg">
        {title}
      </h3>
      <ul className="mt-2 space-y-0.5 text-sm font-normal leading-relaxed text-white/95 sm:text-base">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function slideStyle(visible: boolean, delayMs: number, fromX: number) {
  return {
    transition: visible
      ? `opacity ${CONTENT_MS}ms ${EASE} ${delayMs}ms, transform ${CONTENT_MS}ms ${EASE} ${delayMs}ms`
      : `opacity ${EXIT_MS}ms ${EASE_OUT}, transform ${EXIT_MS}ms ${EASE_OUT}`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : `translate3d(${fromX}px, 14px, 0)`,
    pointerEvents: visible ? "auto" : "none",
  } satisfies CSSProperties;
}

function overlayFadeStyle(visible: boolean) {
  return {
    opacity: visible ? 1 : 0,
    transition: visible ? `opacity ${CONTENT_MS}ms ${EASE}` : `opacity ${EXIT_MS}ms ${EASE_OUT}`,
  } satisfies CSSProperties;
}

export default function OutletDetailView({
  panel,
  originRect,
  containerRef,
  onClose,
}: {
  panel: OpenPanel;
  originRect: OutletOriginRect | null;
  containerRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const { lang } = useSiteLanguage();
  const innerRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef<{ width: number; height: number } | null>(null);
  const closingRef = useRef(false);
  const [expanded, setExpanded] = useState(!originRect);
  const [contentVisible, setContentVisible] = useState(!originRect);

  const gallery = OUTLET_GALLERIES[panel.id];
  const name = lang === "ID" ? panel.nameID : panel.nameEN;
  const address = lang === "ID" ? panel.addressID : panel.addressEN;
  const navLabel = lang === "ID" ? panel.detailNavID : panel.detailNavEN;
  const capacity = lang === "ID" ? panel.capacityID : panel.capacityEN;
  const facilities = lang === "ID" ? panel.facilitiesID : panel.facilitiesEN;
  const hoursLabel = lang === "ID" ? "Jam Operasional" : "Operational Hours";
  const capacityLabel = lang === "ID" ? "Kapasitas" : "Capacity";
  const facilityLabel = lang === "ID" ? "Fasilitas" : "Facility";
  const mapsLabel = lang === "ID" ? "Buka Google Maps" : "Open Google Maps";

  const measureContainer = useCallback(() => {
    const el = containerRef.current;
    if (!el) return null;
    const { width, height } = el.getBoundingClientRect();
    return { width, height };
  }, [containerRef]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const inner = innerRef.current;
    const size = containerSizeRef.current ?? measureContainer();

    setContentVisible(false);

    if (!inner || !originRect || !size) {
      onClose();
      return;
    }

    requestAnimationFrame(() => {
      inner.style.transition = `transform ${COLLAPSE_MS}ms ${EASE_OUT}`;
      inner.style.transform = tileToContainerTransform(
        originRect,
        size.width,
        size.height,
      );

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        inner.removeEventListener("transitionend", onTransitionEnd);
        onClose();
      };

      const onTransitionEnd = (event: TransitionEvent) => {
        if (event.target !== inner || event.propertyName !== "transform") return;
        finish();
      };

      inner.addEventListener("transitionend", onTransitionEnd);
      window.setTimeout(finish, COLLAPSE_MS + 40);
    });
  }, [measureContainer, onClose, originRect]);

  useLayoutEffect(() => {
    closingRef.current = false;
  }, [panel.id]);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const size = measureContainer();

    if (!inner || !size || !originRect) {
      if (size) containerSizeRef.current = size;
      setExpanded(true);
      setContentVisible(true);
      return;
    }

    containerSizeRef.current = size;

    let cancelled = false;
    const collapsed = tileToContainerTransform(originRect, size.width, size.height);

    inner.style.transition = "none";
    inner.style.transform = collapsed;
    void inner.offsetHeight;

    const enterFrame = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        inner.style.transition = `transform ${EXPAND_MS}ms ${EASE}`;
        inner.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
        setExpanded(true);
      });
    });

    const contentTimer = window.setTimeout(() => {
      if (!cancelled) setContentVisible(true);
    }, CONTENT_DELAY_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(enterFrame);
      window.clearTimeout(contentTimer);
    };
  }, [measureContainer, originRect, panel.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const overlayFade = overlayFadeStyle(contentVisible);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden",
        DESKTOP_OUTLET_MIN_H,
      )}
      role="region"
      aria-label={navLabel}
    >
      <div
        ref={innerRef}
        className="pointer-events-auto absolute inset-0 origin-top-left overflow-hidden bg-[#1a0808] will-change-transform transform-gpu"
        style={
          originRect ? undefined : { transform: "translate3d(0, 0, 0) scale(1, 1)" }
        }
      >
        <div
          className={cn(
            "relative min-h-[min(100svh,720px)] w-full sm:min-h-[min(100svh,780px)]",
            DESKTOP_OUTLET_MIN_H,
          )}
        >
          <OutletPhotoCarousel
            images={gallery}
            expanded={expanded}
            contentVisible={contentVisible}
            lang={lang}
          />

          <div className="absolute inset-0 bg-black/35" style={overlayFade} aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/52 to-black/78"
            style={overlayFade}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/28 to-black/45"
            style={overlayFade}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(58%,480px)] bg-gradient-to-t from-black/95 via-black/55 to-transparent"
            style={overlayFade}
            aria-hidden
          />

          <div
            className="absolute bottom-[clamp(1.5rem,6vh,4rem)] left-[clamp(1.25rem,6vw,7.5rem)] z-10 max-w-[min(92vw,520px)] text-white"
            style={slideStyle(contentVisible, 80, -20)}
          >
            <h2 className="font-heroCta text-[clamp(2rem,5vw,3.25rem)] font-normal leading-none tracking-[0.01em]">
              {name}
            </h2>
            <p className="mt-3 font-heroCta text-base leading-snug tracking-[0.01em] text-white/95 sm:text-lg sm:leading-relaxed">
              {address}
            </p>
            <a
              href={panel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-heroCta text-sm text-white/85 underline-offset-4 hover:text-white hover:underline sm:text-base"
            >
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {mapsLabel}
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 flex max-w-full min-h-[44px] items-center gap-2 text-left font-heroCta text-sm tracking-[0.02em] text-white/90 transition-colors hover:text-white sm:mt-7 sm:text-base"
            >
              <ChevronLeft className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={1.5} />
              <span className="leading-snug">{navLabel}</span>
            </button>
          </div>

          <div className="absolute right-[clamp(1.25rem,6vw,7.5rem)] top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-8 sm:flex sm:w-[260px] sm:gap-10 lg:w-[280px]">
            <InfoBlock
              title={hoursLabel}
              lines={[panel.hours]}
              style={slideStyle(contentVisible, 120, 24)}
            />
            <InfoBlock
              title={capacityLabel}
              lines={capacity}
              style={slideStyle(contentVisible, 180, 24)}
            />
            <InfoBlock
              title={facilityLabel}
              lines={facilities}
              style={slideStyle(contentVisible, 240, 24)}
            />
          </div>

          <div className="absolute bottom-[clamp(7rem,22vh,11rem)] left-[clamp(1.25rem,6vw,7.5rem)] right-[clamp(1.25rem,6vw,7.5rem)] z-10 flex flex-col gap-5 sm:hidden">
            <InfoBlock
              title={hoursLabel}
              lines={[panel.hours]}
              style={slideStyle(contentVisible, 120, -12)}
            />
            <InfoBlock
              title={capacityLabel}
              lines={capacity}
              style={slideStyle(contentVisible, 180, -12)}
            />
            <InfoBlock
              title={facilityLabel}
              lines={facilities}
              style={slideStyle(contentVisible, 240, -12)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type { OpenPanel };
