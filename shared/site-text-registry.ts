import type { SiteTextDef, SiteTextEntry, SiteTextPage } from "./site-texts/define";
import { GLOBAL_TEXTS } from "./site-texts/global";
import { HOME_TEXTS } from "./site-texts/home";
import { ABOUT_TEXTS } from "./site-texts/about";
import { KEMITRAAN_TEXTS } from "./site-texts/kemitraan";
import { CATERING_TEXTS } from "./site-texts/catering";
import { OUTLET_TEXTS } from "./site-texts/outlet";
import { DELIVERY_TEXTS } from "./site-texts/delivery";
import { MENU_TEXTS } from "./site-texts/menu";
import { WHATS_ON_TEXTS } from "./site-texts/whats-on";
import { RESERVATION_TEXTS } from "./site-texts/reservation";
import { FAQ_TEXTS } from "./site-texts/faq";
import { LEGAL_TEXTS } from "./site-texts/legal";
import { NOT_FOUND_TEXTS } from "./site-texts/not-found";

export * from "./site-texts/define";

const PAGE_GROUPS = [
  GLOBAL_TEXTS,
  HOME_TEXTS,
  ABOUT_TEXTS,
  KEMITRAAN_TEXTS,
  CATERING_TEXTS,
  OUTLET_TEXTS,
  DELIVERY_TEXTS,
  MENU_TEXTS,
  WHATS_ON_TEXTS,
  RESERVATION_TEXTS,
  FAQ_TEXTS,
  LEGAL_TEXTS,
  NOT_FOUND_TEXTS,
] as const;

export const SITE_TEXT_DEFAULTS = {
  ...GLOBAL_TEXTS.entries,
  ...HOME_TEXTS.entries,
  ...ABOUT_TEXTS.entries,
  ...KEMITRAAN_TEXTS.entries,
  ...CATERING_TEXTS.entries,
  ...OUTLET_TEXTS.entries,
  ...DELIVERY_TEXTS.entries,
  ...MENU_TEXTS.entries,
  ...WHATS_ON_TEXTS.entries,
  ...RESERVATION_TEXTS.entries,
  ...FAQ_TEXTS.entries,
  ...LEGAL_TEXTS.entries,
  ...NOT_FOUND_TEXTS.entries,
} satisfies Record<string, SiteTextEntry>;

export type SiteTextKey = keyof typeof SITE_TEXT_DEFAULTS;

export const SITE_TEXTS: readonly SiteTextDef[] = PAGE_GROUPS.flatMap((group) =>
  Object.entries(group.entries).map(([key, entry]) => ({
    ...(entry as SiteTextEntry),
    key,
    page: group.page as SiteTextPage,
  })),
);

export const SITE_TEXT_MAP: ReadonlyMap<string, SiteTextDef> = new Map(
  SITE_TEXTS.map((def) => [def.key, def]),
);

export function isSiteTextKey(key: string): key is SiteTextKey {
  return SITE_TEXT_MAP.has(key);
}
