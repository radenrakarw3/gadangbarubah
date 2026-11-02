/** Katalog aset visual yang bisa diganti dari admin CMS. */
export const SITE_MEDIA_CATALOG = [
  {
    key: "hero.main",
    labelID: "Hero beranda",
    labelEN: "Home hero",
    hintID: "Foto latar hero landing (disarankan landscape, JPEG/WebP).",
    hintEN: "Landing hero background (landscape JPEG/WebP recommended).",
  },
  {
    key: "outlet.cikarang.cover",
    labelID: "Cover outlet Cikarang",
    labelEN: "Cikarang outlet cover",
    hintID: "Foto kartu outlet Cikarang di beranda.",
    hintEN: "Cikarang outlet card photo on the homepage.",
  },
  {
    key: "outlet.bintaro.cover",
    labelID: "Cover outlet Bintaro",
    labelEN: "Bintaro outlet cover",
    hintID: "Foto kartu outlet Bintaro di beranda.",
    hintEN: "Bintaro outlet card photo on the homepage.",
  },
  {
    key: "outlet.puri-indah.cover",
    labelID: "Cover outlet Puri Indah",
    labelEN: "Puri Indah outlet cover",
    hintID: "Foto kartu outlet coming soon Puri Indah.",
    hintEN: "Coming-soon Puri Indah outlet card photo.",
  },
  {
    key: "outlet.fourth.cover",
    labelID: "Cover outlet ke-4",
    labelEN: "4th outlet cover",
    hintID: "Foto kartu outlet ke-4 (segera hadir).",
    hintEN: "4th outlet coming-soon card photo.",
  },
] as const;

export type SiteMediaKey = (typeof SITE_MEDIA_CATALOG)[number]["key"];

export function isSiteMediaKey(value: string): value is SiteMediaKey {
  return SITE_MEDIA_CATALOG.some((item) => item.key === value);
}
