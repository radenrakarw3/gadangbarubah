import { Link } from "wouter";
import { Instagram } from "lucide-react";
import navLogoIcon from "@assets/gadang-barubah-logo-icon.png";
import { COMPANY, FOOTER_NAV_LEFT, SOCIAL_LINKS } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

const FOOTER_COL1_EN: Record<string, string> = {
  "/": "Home",
  "/about": "About Us",
  "/kemitraan": "Partnership",
  "/whats-on": "What's On",
  "/menu": "Menu",
  "/catering": "Catering",
};

const FOOTER_COL2 = [
  { href: "/reservasi", labelID: "Member", labelEN: "Member" },
  { href: "/admin", labelID: "Login", labelEN: "Login" },
  { href: "/reservasi", labelID: "Daftar", labelEN: "Register" },
  { href: "/faq", labelID: "FAQ", labelEN: "FAQ's" },
] as const;

const linkClass =
  "block py-1 font-heroCta text-[15px] font-normal leading-[1.35] tracking-[0.01em] text-black hover:text-[#3F0000] transition-colors sm:text-base xl:text-[18px] xl:leading-[40px]";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center text-black hover:text-[#3F0000] transition-colors"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function SiteFooter() {
  const { lang } = useSiteLanguage();
  const year = new Date().getFullYear();

  const col1Label = (href: string, label: string) =>
    lang === "EN" ? (FOOTER_COL1_EN[href] ?? label) : label;

  const copyright =
    lang === "ID"
      ? `© ${year} Gadang Barubah, Inc. Hak Cipta Dilindungi.`
      : `© ${year} Gadang Barubah, Inc. All Rights Reserved.`;

  return (
    <footer className="mt-auto w-full shrink-0 border-t border-black/5 bg-white text-black">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col px-4 sm:px-8 lg:px-10 xl:min-h-[520px] xl:px-[clamp(2.5rem,7.5vw,144px)]">
        <div className="flex items-center justify-between border-b border-black/5 py-6 sm:py-8 xl:border-0 xl:pb-0 xl:pt-[88px]">
          <div className="flex items-center gap-5 sm:gap-8">
            <SocialIcon href={SOCIAL_LINKS.tiktok} label="TikTok">
              <TikTokIcon className="h-[22px] w-[22px]" />
            </SocialIcon>
            <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
              <Instagram className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </SocialIcon>
          </div>
          <img
            src={navLogoIcon}
            alt="Gadang Barubah"
            className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 xl:h-[88px] xl:w-[88px]"
            width={88}
            height={88}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-8 gap-y-6 py-8 sm:gap-x-12 lg:grid-cols-[auto_auto_1fr] lg:items-end lg:gap-x-16 xl:gap-x-[clamp(3rem,8vw,120px)] xl:py-0 xl:pb-[88px] xl:pt-10">
          <nav className="flex flex-col gap-0">
            <p className="mb-1 font-heroCta text-xs uppercase tracking-widest text-black/40 xl:hidden">
              {lang === "ID" ? "Navigasi" : "Navigate"}
            </p>
            {FOOTER_NAV_LEFT.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {col1Label(item.href, item.label)}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-0">
            <p className="mb-1 font-heroCta text-xs uppercase tracking-widest text-black/40 xl:hidden">
              Member
            </p>
            {FOOTER_COL2.map((item) => (
              <Link
                key={`${item.href}-${item.labelEN}`}
                href={item.href}
                className={linkClass}
              >
                {lang === "ID" ? item.labelID : item.labelEN}
              </Link>
            ))}
          </nav>

          <div className="col-span-2 flex flex-col justify-end text-left lg:col-span-1 lg:ml-auto lg:max-w-[497px] lg:self-end lg:text-right">
            <p className="font-heroCta text-[15px] font-normal text-black sm:text-base xl:text-[18px] xl:leading-[40px]">
              {COMPANY.name}
            </p>
            <p className="font-heroCta text-sm font-light leading-relaxed text-black sm:text-[15px] xl:text-[18px] xl:leading-[40px]">
              {COMPANY.address}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/5 py-5 sm:flex-row sm:items-center sm:justify-between xl:pb-12">
          <Link href="/terms" className="font-heroCta text-sm italic text-[#7E7E7E] hover:text-black xl:text-base">
            {lang === "ID" ? "Syarat dan Ketentuan" : "Terms and Conditions"}
          </Link>
          <Link href="/privacy" className="font-heroCta text-sm italic text-[#7E7E7E] hover:text-black xl:text-base xl:text-right">
            {lang === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
          </Link>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#FFEEDD] px-4 py-5 xl:h-[120px] xl:py-0">
        <p className="max-w-[520px] text-center font-heroCta text-sm text-black sm:text-base xl:text-lg">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
