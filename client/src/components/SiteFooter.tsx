import { Link } from "wouter";
import { Instagram, Linkedin } from "lucide-react";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import { COMPANY, FOOTER_NAV_LEFT, SOCIAL_LINKS } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

const FOOTER_COL1_EN: Record<string, string> = {
  "/": "Home",
  "/about": "About Us",
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
  "block py-1.5 font-heroCta text-[15px] font-normal leading-snug tracking-[0.01em] text-black hover:text-[#3F0000] transition-colors sm:text-base xl:h-[50px] xl:py-0 xl:text-[20px] xl:leading-[50px]";

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
      className="flex h-10 w-10 items-center justify-center text-black hover:text-[#3F0000] transition-colors xl:h-[46px] xl:w-[46px]"
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
    <footer className="relative border-t border-black/5 bg-white text-black">
      <div className="mx-auto flex max-w-[1920px] flex-col px-4 sm:px-8 lg:px-10 xl:min-h-[600px] xl:px-[clamp(2.5rem,7.5vw,144px)]">
        <div className="flex items-center justify-between pt-6 pb-5 sm:pt-8 xl:items-start xl:pt-[105px] xl:pb-0">
          <div className="flex items-center gap-4 sm:gap-6 xl:gap-[53px]">
            <SocialIcon href={SOCIAL_LINKS.tiktok} label="TikTok">
              <TikTokIcon className="h-5 w-5 xl:h-[46px] xl:w-[46px] xl:p-2" />
            </SocialIcon>
            <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
              <Instagram className="h-5 w-5 xl:h-[46px] xl:w-[46px] xl:p-2" strokeWidth={1.25} />
            </SocialIcon>
            <SocialIcon href={SOCIAL_LINKS.linkedin} label="LinkedIn">
              <Linkedin className="h-5 w-5 xl:h-[46px] xl:w-[46px] xl:p-2" strokeWidth={1.25} />
            </SocialIcon>
          </div>
          <img
            src={logoImage}
            alt="Gadang Barubah"
            className="h-10 w-[72px] object-contain object-right sm:h-12 sm:w-[86px] xl:h-16"
            width={86}
            height={64}
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/5 py-5 sm:gap-x-10 lg:flex lg:flex-1 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-10 lg:border-0 xl:items-center xl:gap-16 xl:py-[72px]">
          <nav className="flex flex-col gap-0.5 xl:gap-[10px]">
            {FOOTER_NAV_LEFT.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass}>
                {col1Label(item.href, item.label)}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-0.5 xl:ml-[274px] xl:gap-[10px]">
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

          <div className="col-span-2 lg:col-span-1 lg:ml-auto lg:max-w-[497px] lg:text-right xl:text-right">
            <p className="mb-1 font-heroCta text-[15px] font-normal leading-snug text-black sm:text-base xl:mb-2 xl:text-center xl:text-[20px] xl:leading-[50px]">
              {COMPANY.name}
            </p>
            <p className="font-heroCta text-sm font-light leading-relaxed text-black sm:text-[15px] xl:text-right xl:text-[20px] xl:leading-[50px]">
              {COMPANY.address}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:border-0 xl:pb-[92px] xl:pt-4">
          <Link
            href="/terms"
            className="font-heroCta text-sm italic font-normal leading-snug tracking-[0.01em] text-[#7E7E7E] transition-colors hover:text-black sm:text-base sm:text-right xl:text-lg xl:leading-[50px]"
          >
            {lang === "ID" ? "Syarat dan Ketentuan" : "Terms and Conditions"}
          </Link>
          <Link
            href="/privacy"
            className="font-heroCta text-sm italic font-normal leading-snug tracking-[0.01em] text-[#7E7E7E] transition-colors hover:text-black sm:text-base xl:text-lg xl:leading-[50px] xl:text-right"
          >
            {lang === "ID" ? "Kebijakan Privasi" : "Policy"}
          </Link>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#FFEEDD] px-4 py-5 sm:py-6 xl:h-[150px] xl:py-0">
        <p className="max-w-[426px] text-center font-heroCta text-sm font-normal leading-snug tracking-[0.01em] text-black sm:text-base xl:text-lg xl:leading-[50px]">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
