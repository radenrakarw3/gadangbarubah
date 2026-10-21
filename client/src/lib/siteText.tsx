import { Fragment, useCallback, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { SITE_TEXT_DEFAULTS, type SiteTextKey } from "@shared/site-text-registry";
import { queryClient } from "./queryClient";
import { useSiteLanguage, type SiteLanguage } from "./language";

export type SiteTextOverrides = Record<string, { id: string; en: string }>;
export type SiteTextVars = Record<string, string | number>;

export const SITE_TEXTS_QUERY_KEY = ["/api/site-texts"] as const;
export const ADMIN_SITE_TEXTS_QUERY_KEY = ["/api/admin/site-texts"] as const;

const siteTextsQueryOptions = {
  queryKey: SITE_TEXTS_QUERY_KEY,
  staleTime: 30_000,
  refetchOnMount: true as const,
};

export function prefetchSiteTexts() {
  return queryClient.prefetchQuery(siteTextsQueryOptions);
}

export function resolveSiteText(
  key: SiteTextKey,
  lang: SiteLanguage,
  overrides?: SiteTextOverrides,
  vars?: SiteTextVars,
): string {
  const override = overrides?.[key];
  const def = SITE_TEXT_DEFAULTS[key];
  let value = lang === "ID" ? override?.id || def.id : override?.en || def.en;
  if (vars) {
    value = value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  }
  return value;
}

/** Sisipkan elemen (mis. link) ke placeholder {nama} di teks. */
export function renderTemplate(text: string, nodes: Record<string, ReactNode>): ReactNode {
  return text.split(/(\{\w+\})/g).map((part, index) => {
    const match = /^\{(\w+)\}$/.exec(part);
    const node = match && match[1] in nodes ? nodes[match[1]] : part;
    return <Fragment key={index}>{node}</Fragment>;
  });
}

/** Teks website: override dari admin (DB) atau default di shared/site-texts. */
export function useSiteText() {
  const { lang } = useSiteLanguage();
  const { data } = useQuery<{ success: boolean; texts: SiteTextOverrides }>(siteTextsQueryOptions);
  const overrides = data?.texts;

  const t = useCallback(
    (key: SiteTextKey, vars?: SiteTextVars) => resolveSiteText(key, lang, overrides, vars),
    [lang, overrides],
  );

  /** Teks daftar: satu item per baris. */
  const tl = useCallback(
    (key: SiteTextKey) =>
      t(key)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [t],
  );

  return { t, tl, lang };
}
