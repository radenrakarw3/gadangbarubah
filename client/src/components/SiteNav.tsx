import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import navLogoIcon from "@assets/gadang-barubah-logo-icon.png";
import { MAIN_NAV, COMPANY } from "@/lib/siteContent";

import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const FIGMA_LEFT_NAV = [
  { href: "/kemitraan", labelEN: "PARTNERSHIP", labelID: "KEMITRAAN" },
  { href: "/about", labelEN: "ABOUT US", labelID: "TENTANG KAMI" },
] as const;

const EN_EXTRA_LABELS: Record<string, string> = {
  "/": "HOME",
  "/menu": "MENU",
  "/catering": "CATERING",
  "/reservasi": "RESERVE",
  "/whats-on": "WHAT'S ON",
};

const EXTRA_NAV = MAIN_NAV.filter(
  (n) => !FIGMA_LEFT_NAV.some((l) => l.href === n.href),
);

function whatsappContactHref(lang: "ID" | "EN") {
  const text = encodeURIComponent(
    lang === "ID" ? "Halo Gadang Barubah! Saya ingin bertanya." : "Hello Gadang Barubah! I have a question.",
  );
  return `https://wa.me/${COMPANY.whatsapp}?text=${text}`;
}

interface SiteNavProps {
  variant?: "default" | "transparent";
}

/** Shadow tipis agar nav tetap terbaca di hero gelap maupun section terang */
const TRANSPARENT_NAV_TEXT_SHADOW =
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.92),0_0_12px_rgba(0,0,0,0.55)]";

const TRANSPARENT_NAV_ICON_SHADOW =
  "drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]";

function NavLogoMark({ className }: { className?: string }) {
  return (
    <img
      src={navLogoIcon}
      alt=""
      className={cn("shrink-0 object-contain", TRANSPARENT_NAV_ICON_SHADOW, className)}
      width={48}
      height={48}
      loading="eager"
      decoding="async"
    />
  );
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <span className={cn("flex h-2 w-4 flex-col justify-between", className)} aria-hidden>
      <span className="block h-px w-full bg-current" />
      <span className="block h-px w-full bg-current" />
      <span className="block h-px w-full bg-current" />
    </span>
  );
}

function NavFullscreenMenu({
  open,
  onClose,
  lang,
  setLang,
}: {
  open: boolean;
  onClose: () => void;
  lang: "ID" | "EN";
  setLang: (l: "ID" | "EN") => void;
}) {
  const mobileLinks = [...FIGMA_LEFT_NAV, ...EXTRA_NAV];

  const getLabel = (item: (typeof mobileLinks)[number]) => {
    if ("labelEN" in item) return lang === "ID" ? item.labelID : item.labelEN;
    return lang === "EN"
      ? (EN_EXTRA_LABELS[item.href] ?? item.label.toUpperCase())
      : item.label;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={lang === "ID" ? "Menu navigasi" : "Navigation menu"}
    >
      {/* Backdrop semi-transparan — hero/konten masih terlihat samar */}
      <button
        type="button"
        className="absolute inset-0 bg-[#1a0505]/72 backdrop-blur-[14px] supports-[backdrop-filter]:bg-[#1a0505]/65"
        onClick={onClose}
        aria-label={lang === "ID" ? "Tutup menu" : "Close menu"}
      />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col safe-top safe-bottom">
        <div className="relative flex h-[72px] shrink-0 items-center justify-end px-5 sm:h-[100px] sm:px-8">
          <Link
            href="/"
            onClick={onClose}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-90 transition-opacity"
            aria-label="Gadang Barubah"
          >
            <NavLogoMark className="h-11 w-11 sm:h-14 sm:w-14" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label={lang === "ID" ? "Tutup menu" : "Close menu"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 sm:px-12 py-6 sm:py-10">
          <ul className="mx-auto flex max-w-lg flex-col gap-1 sm:gap-2">
            {mobileLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center py-3 sm:py-4 font-heroCta text-2xl sm:text-3xl font-normal uppercase tracking-[0.06em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] transition-all hover:translate-x-1 hover:text-[#FFEEDD]"
                >
                  <span className="mr-4 h-px w-0 bg-[#FFEEDD]/80 transition-all group-hover:w-8" aria-hidden />
                  {getLabel(item)}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={whatsappContactHref(lang)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group flex items-center py-3 sm:py-4 font-heroCta text-2xl sm:text-3xl font-normal uppercase tracking-[0.06em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] transition-all hover:translate-x-1 hover:text-[#FFEEDD]"
              >
                <span className="mr-4 h-px w-0 bg-[#FFEEDD]/80 transition-all group-hover:w-8" aria-hidden />
                {lang === "ID" ? "KONTAK" : "CONTACT"}
              </a>
            </li>
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/15 bg-black/20 px-6 sm:px-12 py-6 sm:py-8 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="font-heroCta text-xs uppercase tracking-[0.2em] text-white/50">
                {lang === "ID" ? "Bahasa" : "Language"}
              </span>
              <div className="flex gap-2">
                {(["ID", "EN"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={cn(
                      "min-w-[40px] rounded-[5px] px-3 py-1.5 font-sans text-sm transition-colors",
                      lang === code
                        ? "bg-[#F6F6F6] font-bold text-[#2C2C2C]"
                        : "border border-white/30 text-white hover:bg-white/10",
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
            <Link
              href="/reservasi"
              onClick={onClose}
              className="inline-flex h-[52px] items-center justify-center rounded-lg bg-[rgba(89,0,0,0.95)] px-8 font-heroCta text-base font-bold italic tracking-[0.03em] text-[rgba(210,210,210,0.95)] shadow-lg hover:bg-[#590000] transition-colors sm:shrink-0"
            >
              {lang === "ID" ? "Reservasi Sekarang" : "Reserve Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SiteNav({ variant = "default" }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const { lang, setLang } = useSiteLanguage();
  const isTransparent = variant === "transparent";

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!isTransparent) {
      setPastHero(false);
      return;
    }

    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [isTransparent]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  const navText = cn(
    "text-figma-nav font-normal uppercase transition-opacity hover:opacity-85",
    isTransparent
      ? cn("text-white", TRANSPARENT_NAV_TEXT_SHADOW)
      : "text-foreground/90 hover:text-[#3F0000]",
  );

  const langBtn = (code: "ID" | "EN", mobileDark = false) => {
    const active = lang === code;
    if (mobileDark) {
      return (
        <button
          type="button"
          onClick={() => setLang(code)}
          className={cn(
            "min-w-[32px] rounded-md px-2 py-1 font-sans text-[11px] font-semibold leading-none transition-colors",
            active
              ? "bg-[#590000] text-[#F2E8E8] shadow-sm"
              : "border border-white/25 bg-black/25 text-white/90 hover:bg-black/40",
          )}
          aria-pressed={active}
        >
          {code}
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setLang(code)}
        className={cn(
          "font-sans text-[11px] leading-[13px]",
          active
            ? "min-w-[22px] rounded-[4px] bg-[#F6F6F6] px-1 py-0.5 font-bold text-[#2C2C2C] shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
            : isTransparent
              ? cn("font-normal text-white", TRANSPARENT_NAV_TEXT_SHADOW)
              : "font-normal text-muted-foreground hover:text-foreground",
        )}
        aria-pressed={active}
      >
        {code}
      </button>
    );
  };

  const langToggle = (mobileDark = false) => (
    <div
      className={cn(
        "flex shrink-0 items-center",
        mobileDark ? "gap-1 rounded-md border border-white/15 bg-black/20 p-0.5" : "flex-row-reverse gap-1.5",
      )}
    >
      {langBtn("EN", mobileDark)}
      {langBtn("ID", mobileDark)}
    </div>
  );

  const menuTrigger = (className?: string, mobileGlass = false) => (
    <button
      type="button"
      className={cn(
        "transition-colors",
        mobileGlass
          ? "flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-black/30 text-white hover:bg-black/45"
          : cn(
              "p-1.5",
              isTransparent
                ? cn("text-white", TRANSPARENT_NAV_ICON_SHADOW)
                : "text-foreground",
            ),
        className,
      )}
      onClick={toggleMenu}
      aria-label={lang === "ID" ? "Menu navigasi" : "Navigation menu"}
      aria-expanded={open}
    >
      {open ? (
        <X className={cn("h-4 w-4 sm:h-5 sm:w-5", isTransparent && TRANSPARENT_NAV_ICON_SHADOW)} />
      ) : (
        <HamburgerIcon className={isTransparent ? TRANSPARENT_NAV_ICON_SHADOW : undefined} />
      )}
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "relative z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
          isTransparent
            ? "fixed top-0 left-0 right-0 border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
            : "sticky top-0 border-b border-border/40 bg-ivory/[0.98] shadow-sm",
        )}
      >
        {isTransparent ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(100%+4.5rem)] bg-gradient-to-b from-black/95 via-black/65 to-transparent transition-opacity duration-500 ease-out",
              pastHero ? "opacity-100" : "opacity-0",
            )}
            aria-hidden
          />
        ) : null}

        <div className="relative z-10 mx-auto hidden h-[72px] max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 xl:grid xl:gap-5 xl:px-16">
          <div className="flex items-center justify-self-start gap-4 xl:gap-5">
            {FIGMA_LEFT_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={navText}>
                {lang === "ID" ? item.labelID : item.labelEN}
              </Link>
            ))}
            {menuTrigger()}
          </div>

          <Link
            href="/"
            className="justify-self-center hover:opacity-90 transition-opacity"
            aria-label="Gadang Barubah"
          >
            <NavLogoMark className="h-11 w-11 xl:h-12 xl:w-12" />
          </Link>

          <div className="flex items-center justify-self-end gap-4 xl:gap-5">
            <a
              href={whatsappContactHref(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={navText}
            >
              {lang === "ID" ? "KONTAK" : "CONTACT"}
            </a>
            <Link href="/reservasi" className={navText}>
              {lang === "ID" ? "RESERVASI" : "RESERVE"}
            </Link>
            {langToggle()}
          </div>
        </div>

        <div className="relative z-10 safe-top xl:hidden">
          <div className="relative flex h-12 items-center justify-between gap-2 px-4">
            <div className="z-10 flex shrink-0 items-center">{menuTrigger(undefined, true)}</div>
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 hover:opacity-90"
              aria-label="Gadang Barubah"
            >
              <NavLogoMark className="h-9 w-9" />
            </Link>
            <div className="z-10 flex shrink-0 items-center gap-1 rounded-md border border-white/15 bg-black/20 p-0.5">
              <Link
                href="/reservasi"
                className="inline-flex min-w-[32px] items-center justify-center rounded-md px-2 py-1 font-sans text-[11px] font-semibold leading-none text-[#F2E8E8] transition-colors bg-[#590000] shadow-sm hover:bg-[#6a0000]"
              >
                {lang === "ID" ? "BOOK" : "BOOK"}
              </Link>
              {langBtn("EN", true)}
              {langBtn("ID", true)}
            </div>
          </div>
        </div>
      </header>

      <NavFullscreenMenu open={open} onClose={closeMenu} lang={lang} setLang={setLang} />
    </>
  );
}
