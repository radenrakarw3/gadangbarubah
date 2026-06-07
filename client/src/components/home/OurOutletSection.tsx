import { memo } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { HOME_OUTLET_PANELS } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import cikarangImg from "@assets/DSC07220_1758567803910.jpg";
import bintaroImg from "@assets/DSC03165_1758567860370.jpg";
import puriIndahImg from "@assets/DSC03078_1758567885565.jpg";
import fourthOutletImg from "@assets/DSC03147_1758567860387.jpg";

const TONE_BG = {
  gray: "bg-[#D9D9D9]",
  salmon: "bg-[#C75757]",
} as const;

const TONE_FADE = {
  gray: "from-[#D9D9D9]",
  salmon: "from-[#C75757]",
} as const;

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
}: {
  panel: Panel;
  lang: "ID" | "EN";
  layout: "desktop" | "mobile";
}) {
  const name = lang === "ID" ? panel.nameID : panel.nameEN;
  const address = lang === "ID" ? panel.addressID : panel.addressEN;
  const isOpen = panel.status === "open";
  const image = PANEL_IMAGES[panel.id];
  const mapsHint = lang === "ID" ? "Buka Google Maps" : "Open Google Maps";
  const soonLabel = lang === "ID" ? "Segera Hadir" : "Coming Soon";

  const card = (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden",
        layout === "mobile" && "rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.4)]",
        isOpen && "cursor-pointer",
      )}
    >
      {/* Area foto — dominan, bersih */}
      <div
        className={cn(
          "relative min-h-0 overflow-hidden",
          layout === "desktop" ? "flex-1" : "aspect-[5/4] sm:aspect-[4/3]",
        )}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        {/* Transisi tipis foto → strip info */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t to-transparent",
            TONE_FADE[panel.tone],
          )}
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
      </div>

      {/* Strip info — solid, Figma */}
      <div
        className={cn(
          TONE_BG[panel.tone],
          layout === "desktop"
            ? "shrink-0 px-[clamp(1.5rem,2.9vw,3.5rem)] pb-[49px] pt-6"
            : "shrink-0 px-4 pb-5 pt-4",
        )}
      >
        <h3
          className={cn(
            "font-heroCta tracking-[0.01em] text-[#3D0C0C]",
            layout === "desktop"
              ? "text-[clamp(1.375rem,1.45vw,1.75rem)] leading-tight"
              : "text-lg leading-snug",
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-1 font-heroCta leading-snug tracking-[0.01em] text-[#3D0C0C]/85",
            layout === "desktop"
              ? "text-[clamp(1rem,1.04vw,1.25rem)]"
              : "text-sm",
          )}
        >
          {address}
        </p>

        {isOpen ? (
          <p className="mt-3 flex items-center gap-1.5 font-heroCta text-sm text-[#3D0C0C]/70 transition-colors group-hover:text-[#3D0C0C]">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {mapsHint}
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
          </p>
        ) : null}
      </div>
    </article>
  );

  if (isOpen && "href" in panel && panel.href) {
    return (
      <a
        href={panel.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C75757]"
        aria-label={`${name} — ${address}`}
      >
        {card}
      </a>
    );
  }

  return card;
}

function OurOutletSection() {
  const { lang } = useSiteLanguage();
  const title = lang === "ID" ? "Outlet Kami" : "Our Outlet";
  const subtitle =
    lang === "ID"
      ? "Kunjungi cabang terdekat atau nantikan lokasi baru kami."
      : "Visit our nearest branch or stay tuned for new locations.";

  return (
    <section
      id="outlet-section"
      className="relative scroll-mt-16 overflow-hidden bg-[#300505] sm:scroll-mt-24"
    >
      {/* Mobile / tablet — grid kartu */}
      <div className="px-4 py-10 sm:px-8 xl:hidden">
        <header className="mb-8 text-center">
          <h2 className="text-figma-section-title text-white">{title}</h2>
          <p className="mx-auto mt-2 max-w-md font-heroCta text-sm leading-relaxed text-white/70">
            {subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOME_OUTLET_PANELS.map((panel) => (
            <OutletCard key={panel.id} panel={panel} lang={lang} layout="mobile" />
          ))}
        </div>
      </div>

      {/* Desktop — 4 kolom, hairline gap */}
      <div className="mx-auto hidden w-full max-w-[1920px] xl:grid xl:min-h-[800px] xl:grid-cols-4 xl:gap-px xl:bg-black/30">
        {HOME_OUTLET_PANELS.map((panel) => (
          <OutletCard key={panel.id} panel={panel} lang={lang} layout="desktop" />
        ))}
      </div>
    </section>
  );
}

export default memo(OurOutletSection);
