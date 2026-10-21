export const SITE_TEXT_PAGES = [
  { id: "global", label: "Navigasi & Footer", path: "/" },
  { id: "home", label: "Beranda", path: "/" },
  { id: "about", label: "Tentang Kami", path: "/about" },
  { id: "kemitraan", label: "Kemitraan", path: "/kemitraan" },
  { id: "catering", label: "Katering", path: "/catering" },
  { id: "outlet", label: "Outlet", path: "/services/outlet" },
  { id: "delivery", label: "Delivery", path: "/services/delivery" },
  { id: "menu", label: "Menu", path: "/menu" },
  { id: "whatsOn", label: "What's On", path: "/whats-on" },
  { id: "reservation", label: "Reservasi", path: "/reservasi" },
  { id: "faq", label: "FAQ", path: "/faq" },
  { id: "legal", label: "Syarat & Privasi", path: "/terms" },
  { id: "notFound", label: "Halaman 404", path: "/halaman-tidak-ada" },
] as const;

export type SiteTextPage = (typeof SITE_TEXT_PAGES)[number]["id"];

export interface SiteTextEntry {
  section: string;
  label: string;
  id: string;
  en: string;
  /** Textarea di admin; baris baru dipertahankan saat tampil */
  multiline?: boolean;
  /** Satu item per baris (dipakai lewat tl()) */
  list?: boolean;
  maxLength?: number;
}

export interface SiteTextDef extends SiteTextEntry {
  key: string;
  page: SiteTextPage;
}

export function definePageTexts<const T extends Record<string, SiteTextEntry>>(
  page: SiteTextPage,
  entries: T,
) {
  return { page, entries };
}

export const SITE_TEXT_DEFAULT_MAX = 300;
export const SITE_TEXT_MULTILINE_MAX = 8000;

/** Kode seperti {year} atau {terms} yang diganti otomatis saat teks ditampilkan. */
export function siteTextPlaceholders(text: string): string[] {
  return Array.from(new Set(text.match(/\{\w+\}/g) ?? []));
}

export function missingSiteTextPlaceholders(defaultText: string, value: string): string[] {
  return siteTextPlaceholders(defaultText).filter((code) => !value.includes(code));
}

export function siteTextMaxLength(entry: Pick<SiteTextEntry, "multiline" | "list" | "maxLength">) {
  if (entry.maxLength) return entry.maxLength;
  return entry.multiline || entry.list ? SITE_TEXT_MULTILINE_MAX : SITE_TEXT_DEFAULT_MAX;
}
