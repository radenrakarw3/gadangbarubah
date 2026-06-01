import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import { MAIN_NAV } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const FIGMA_LEFT_NAV = [
  { href: "/whats-on", labelEN: "WHAT'S ON", labelID: "WHAT'S ON" },
  { href: "/about", labelEN: "ABOUT US", labelID: "TENTANG KAMI" },
] as const;

const EN_EXTRA_LABELS: Record<string, string> = {
  "/": "HOME",
  "/menu": "MENU",
  "/catering": "CATERING",
  "/reservasi": "RESERVE",
};

const EXTRA_NAV = MAIN_NAV.filter(
  (n) => !FIGMA_LEFT_NAV.some((l) => l.href === n.href),
);

interface SiteNavProps {
  variant?: "default" | "transparent";
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col justify-between w-5 h-2.5", className)} aria-hidden>
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
        <div className="flex h-[72px] sm:h-[100px] shrink-0 items-center justify-between px-5 sm:px-8">
          <Link href="/" onClick={onClose} className="hover:opacity-90 transition-opacity">
            <img
              src={logoImage}
              alt="Gadang Barubah"
              className="h-11 w-auto sm:h-14 object-contain drop-shadow-md"
              width={63}
            />
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
                href="#contact-section"
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
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useSiteLanguage();
  const isTransparent = variant === "transparent";

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!isTransparent) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    "text-figma-nav uppercase transition-opacity hover:opacity-85",
    isTransparent
      ? "text-white [text-shadow:0_0_4.3px_rgba(0,0,0,0.79)]"
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
          "font-sans text-[15px] leading-[18px]",
          active
            ? "min-w-[26px] rounded-[5px] bg-[#F6F6F6] px-1.5 py-1 font-bold text-[#2C2C2C]"
            : isTransparent
              ? "font-normal text-white [text-shadow:0_0_4.3px_rgba(0,0,0,0.79)]"
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
        mobileDark ? "gap-1 rounded-md border border-white/15 bg-black/20 p-0.5" : "flex-row-reverse gap-[10px]",
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
          : cn("p-2", isTransparent ? "text-white" : "text-foreground"),
        className,
      )}
      onClick={toggleMenu}
      aria-label={lang === "ID" ? "Menu navigasi" : "Navigation menu"}
      aria-expanded={open}
    >
      {open ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <HamburgerIcon />}
    </button>
  );

  return (
    <>
      <header
        className={cn(
          "z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
          isTransparent
            ? cn(
                "fixed top-0 left-0 right-0",
                scrolled
                  ? "border-b border-white/10 bg-[#1a0505]/92 shadow-[0_4px_24px_rgba(0,0,0,0.28)] backdrop-blur-md supports-[backdrop-filter]:bg-[#1a0505]/85"
                  : "border-b border-white/10 bg-[#140404]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#140404]/72 max-lg:bg-[#140404]/88",
              )
            : "sticky top-0 border-b border-border/40 bg-ivory/[0.98] shadow-sm",
        )}
      >
        <div className="relative hidden min-[1920px]:block h-[100px] max-w-[1920px] mx-auto">
          {FIGMA_LEFT_NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(navText, "absolute top-[45px]")}
              style={{ left: i === 0 ? 125 : 293 }}
            >
              {lang === "ID" ? item.labelID : item.labelEN}
            </Link>
          ))}

          <div className="absolute left-[457px] top-[49px]">{menuTrigger()}</div>

          <Link
            href="/"
            className="absolute left-1/2 top-[30px] -translate-x-1/2 w-[63px] hover:opacity-90 transition-opacity"
          >
            <img
              src={logoImage}
              alt="Gadang Barubah"
              className="w-[63px] h-auto object-contain"
              width={63}
              loading="eager"
            />
          </Link>

          <a href="#contact-section" className={cn(navText, "absolute top-[45px] left-[1439px]")}>
            {lang === "ID" ? "KONTAK" : "CONTACT"}
          </a>

          <Link href="/reservasi" className={cn(navText, "absolute top-[45px] right-[255px]")}>
            {lang === "ID" ? "RESERVASI" : "RESERVE"}
          </Link>

          <div className="absolute right-[125px] top-[40px]">{langToggle()}</div>
        </div>

        <div className="hidden lg:flex min-[1920px]:hidden h-[100px] max-w-[1920px] mx-auto items-center justify-between px-8 xl:px-16 gap-4">
          <div className="flex items-center gap-6 xl:gap-10">
            {FIGMA_LEFT_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={navText}>
                {lang === "ID" ? item.labelID : item.labelEN}
              </Link>
            ))}
            {menuTrigger()}
          </div>

          <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
            <img
              src={logoImage}
              alt="Gadang Barubah"
              className="w-[63px] h-auto object-contain"
              width={63}
              loading="eager"
            />
          </Link>

          <div className="flex items-center gap-5 xl:gap-8">
            <a href="#contact-section" className={navText}>
              {lang === "ID" ? "KONTAK" : "CONTACT"}
            </a>
            <Link href="/reservasi" className={navText}>
              {lang === "ID" ? "RESERVASI" : "RESERVE"}
            </Link>
            {langToggle()}
          </div>
        </div>

        <div className="safe-top lg:hidden">
          <div className="grid h-12 grid-cols-[2.25rem_1fr_auto] items-center gap-2 px-4">
            {menuTrigger(undefined, true)}
            <Link href="/" className="justify-self-center hover:opacity-90">
              <img
                src={logoImage}
                alt="Gadang Barubah"
                className="mx-auto h-8 w-auto max-w-[52px] object-contain drop-shadow-md"
                width={63}
                loading="eager"
              />
            </Link>
            <div className="flex items-center justify-end gap-1.5">
              <Link
                href="/reservasi"
                className="inline-flex h-8 shrink-0 items-center rounded-md bg-[rgba(89,0,0,0.92)] px-2 font-heroCta text-[10px] font-bold italic tracking-[0.04em] text-[#F0E6E6] hover:bg-[#6a0000]"
              >
                {lang === "ID" ? "BOOK" : "BOOK"}
              </Link>
              {langToggle(true)}
            </div>
          </div>
        </div>
      </header>

      <NavFullscreenMenu open={open} onClose={closeMenu} lang={lang} setLang={setLang} />
    </>
  );
}
