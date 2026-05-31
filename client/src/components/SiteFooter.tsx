import { Link } from "wouter";
import { Instagram, Linkedin } from "lucide-react";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import {
  COMPANY,
  FOOTER_NAV_LEFT,
  FOOTER_NAV_RIGHT,
  LEGAL_NAV,
  SOCIAL_LINKS,
} from "@/lib/siteContent";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-maroon-deep text-cream border-t border-gold/20">
      {/* Social icons row */}
      <div className="border-b border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center gap-8">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/70 hover:text-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/70 hover:text-gold transition-colors"
            aria-label="TikTok"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/70 hover:text-gold transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-16">
          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:col-span-1">
            <nav className="space-y-3">
              {FOOTER_NAV_LEFT.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-cream/75 hover:text-gold transition-colors text-sm tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="space-y-3">
              {FOOTER_NAV_RIGHT.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-cream/75 hover:text-gold transition-colors text-sm tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company info */}
          <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-start sm:justify-end gap-6">
            <div className="flex items-start gap-4 sm:text-right sm:ml-auto">
              <img
                src={logoImage}
                alt="Gadang Barubah"
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0"
                loading="lazy"
              />
              <div>
                <p className="font-display text-xl text-gold mb-2 tracking-wide">Gadang Barubah</p>
                <p className="text-cream/90 text-sm font-medium mb-2">{COMPANY.name}</p>
                <p className="text-cream/60 text-sm leading-relaxed max-w-sm">{COMPANY.address}</p>
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-gold hover:underline"
                >
                  {COMPANY.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/15 mt-8 sm:mt-10 pt-5 sm:pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-cream/50 hover:text-gold text-xs transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-cream/40 text-xs tracking-wide">
            © {new Date().getFullYear()} Gadang Barubah, Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
