import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import { MAIN_NAV } from "@/lib/siteContent";

const LEFT_NAV = [
  { href: "/whats-on", label: "What's On" },
  { href: "/about", label: "About" },
] as const;

interface SiteNavProps {
  variant?: "default" | "transparent";
}

export default function SiteNav({ variant = "default" }: SiteNavProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const navBg =
    variant === "transparent"
      ? "bg-transparent border-transparent"
      : "bg-ivory/[0.98] border-border/40 shadow-sm";

  const mobileLinks = [...LEFT_NAV, ...MAIN_NAV.filter((n) => !LEFT_NAV.some((l) => l.href === n.href))];

  return (
    <header className={`sticky top-0 z-50 border-b safe-top ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 sm:h-[4.5rem] gap-2">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {LEFT_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link-luxury">
                <span className={isActive(item.href) ? "text-gold" : ""}>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              className="nav-link-luxury lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </nav>

          {/* Mobile menu trigger (left on small screens) */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden justify-self-start"
            onClick={() => setOpen(!open)}
            aria-label="Menu navigasi"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Center logo */}
          <Link
            href="/"
            className="flex flex-col items-center justify-self-center hover:opacity-90 transition-opacity group"
          >
            <img
              src={logoImage}
              alt="Gadang Barubah"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              loading="eager"
            />
          </Link>

          {/* Right nav */}
          <div className="hidden lg:flex items-center justify-end gap-5">
            <a href="#contact-section" className="nav-link-luxury">
              Contact
            </a>
            <Link href="/reservasi">
              <Button className="btn-reserve rounded-none h-9">Reserve</Button>
            </Link>
            <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest border-l border-border/60 pl-5">
              <button
                type="button"
                onClick={() => setLang("EN")}
                className={lang === "EN" ? "text-gold" : "text-muted-foreground hover:text-foreground"}
              >
                EN
              </button>
              <span className="text-muted-foreground/50">/</span>
              <button
                type="button"
                onClick={() => setLang("ID")}
                className={lang === "ID" ? "text-gold" : "text-muted-foreground hover:text-foreground"}
              >
                ID
              </button>
            </div>
          </div>

          {/* Mobile reserve */}
          <Link href="/reservasi" className="lg:hidden justify-self-end">
            <Button size="sm" className="btn-reserve rounded-none h-9 text-[11px] px-3.5">
              Reserve
            </Button>
          </Link>
        </div>

        {open && (
          <div className="lg:hidden pb-4 pt-3 border-t border-border/30 space-y-0.5 max-h-[70vh] overflow-y-auto">
            {mobileLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start font-medium tracking-wide h-11 text-base">
                  {item.label}
                </Button>
              </Link>
            ))}
            <a href="#contact-section" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium tracking-wide h-11 text-base">
                Contact
              </Button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
