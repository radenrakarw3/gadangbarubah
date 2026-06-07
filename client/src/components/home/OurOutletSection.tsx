import { memo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { HOME_OUTLET_PANELS } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import OutletDetailView, { type OpenPanel, type OutletOriginRect } from "./OutletDetailView";
import cikarangImg from "@assets/DSC07220_1758567803910.jpg";
import bintaroImg from "@assets/DSC03165_1758567860370.jpg";
import puriIndahImg from "@assets/DSC03078_1758567885565.jpg";
import fourthOutletImg from "@assets/DSC03147_1758567860387.jpg";

const PANEL_IMAGES: Record<(typeof HOME_OUTLET_PANELS)[number]["id"], string> = {
  cikarang: cikarangImg,
  bintaro: bintaroImg,
  "puri-indah": puriIndahImg,
  "fourth-outlet": fourthOutletImg,
};

type Panel = (typeof HOME_OUTLET_PANELS)[number];

function OutletCard({
  panel,
  lang,
  layout,
  onOpen,
}: {
  panel: Panel;
  lang: "ID" | "EN";
  layout: "desktop" | "mobile";
  onOpen: (panel: OpenPanel, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const name = lang === "ID" ? panel.nameID : panel.nameEN;
  const address = lang === "ID" ? panel.addressID : panel.addressEN;
  const isOpen = panel.status === "open";
  const image = PANEL_IMAGES[panel.id];
  const detailHint = lang === "ID" ? "Lihat detail outlet" : "View outlet details";
  const soonLabel = lang === "ID" ? "Segera Hadir" : "Coming Soon";

  const card = (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden",
        layout === "mobile" && "rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.4)]",
        isOpen && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "relative min-h-0 overflow-hidden",
          layout === "desktop" ? "h-full flex-1" : "aspect-[5/4] sm:aspect-[4/3]",
        )}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          aria-hidden
        />

        {!isOpen ? (
          <>
            <div className="absolute inset-0 bg-black/40" aria-hidden />
            <span className="absolute left-4 top-4 rounded-md bg-black/55 px-2.5 py-1 font-heroCta text-[10px] uppercase tracking-[0.14em] text-white">
              {soonLabel}
            </span>
          </>
        ) : null}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-[1]",
            layout === "desktop"
              ? "px-[clamp(1.5rem,2.9vw,3.5rem)] pb-[clamp(2rem,4vh,3rem)] pt-10"
              : "px-4 pb-5 pt-8",
          )}
        >
          <h3
            className={cn(
              "font-heroCta tracking-[0.01em] text-white",
              layout === "desktop"
                ? "text-[clamp(1.375rem,1.45vw,1.75rem)] leading-tight"
                : "text-lg leading-snug",
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "mt-1 font-heroCta leading-snug tracking-[0.01em] text-white/90",
              layout === "desktop"
                ? "text-[clamp(1rem,1.04vw,1.25rem)]"
                : "text-sm",
            )}
          >
            {address}
          </p>

          {isOpen ? (
            <p className="mt-3 flex items-center gap-1.5 font-heroCta text-sm text-white/75 transition-colors duration-300 group-hover:text-white">
              {detailHint}
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (isOpen) {
    return (
      <button
        type="button"
        onClick={(event) => onOpen(panel as OpenPanel, event)}
        className="block h-full w-full touch-manipulation text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C75757] [-webkit-tap-highlight-color:transparent]"
        aria-label={`${name} — ${address}`}
      >
        {card}
      </button>
    );
  }

  return card;
}

function OurOutletSection() {
  const { lang } = useSiteLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [detailPanel, setDetailPanel] = useState<OpenPanel | null>(null);
  const [originRect, setOriginRect] = useState<OutletOriginRect | null>(null);

  const title = lang === "ID" ? "Outlet Kami" : "Our Outlet";
  const subtitle =
    lang === "ID"
      ? "Kunjungi cabang terdekat atau nantikan lokasi baru kami."
      : "Visit our nearest branch or stay tuned for new locations.";

  const handleOpen = (panel: OpenPanel, event: React.MouseEvent<HTMLButtonElement>) => {
    const container = containerRef.current?.getBoundingClientRect();
    const tile = event.currentTarget.getBoundingClientRect();

    if (container) {
      setOriginRect({
        top: tile.top - container.top,
        left: tile.left - container.left,
        width: tile.width,
        height: tile.height,
      });
    } else {
      setOriginRect(null);
    }

    setDetailPanel(panel);
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleClose = () => {
    setDetailPanel(null);
    setOriginRect(null);
  };

  return (
    <section className="relative bg-[#300505]">
      {!detailPanel ? (
        <div className="px-4 py-10 sm:px-8 xl:hidden">
          <header className="mb-8 text-center">
            <h2 className="text-figma-section-title text-white">{title}</h2>
            <p className="mx-auto mt-2 max-w-md font-heroCta text-sm leading-relaxed text-white/70">
              {subtitle}
            </p>
          </header>
        </div>
      ) : null}

      <div ref={containerRef} className="relative w-full xl:min-h-[800px]">
        <div
          className={cn(
            detailPanel ? "pointer-events-none" : undefined,
            "xl:min-h-[800px]",
          )}
        >
          <div className="grid grid-cols-1 gap-4 px-4 pb-10 sm:grid-cols-2 sm:px-8 xl:hidden">
            {HOME_OUTLET_PANELS.map((panel) => (
              <OutletCard
                key={panel.id}
                panel={panel}
                lang={lang}
                layout="mobile"
                onOpen={handleOpen}
              />
            ))}
          </div>

          <div className="mx-auto hidden w-full max-w-[1920px] xl:grid xl:min-h-[800px] xl:grid-cols-4 xl:gap-px xl:bg-black/30">
            {HOME_OUTLET_PANELS.map((panel) => (
              <OutletCard
                key={panel.id}
                panel={panel}
                lang={lang}
                layout="desktop"
                onOpen={handleOpen}
              />
            ))}
          </div>
        </div>

        {detailPanel ? (
          <OutletDetailView
            panel={detailPanel}
            originRect={originRect}
            containerRef={containerRef}
            onClose={handleClose}
          />
        ) : null}
      </div>
    </section>
  );
}

export default memo(OurOutletSection);
