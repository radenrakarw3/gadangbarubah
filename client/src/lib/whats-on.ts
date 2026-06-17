import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import type { WhatsOnArticle } from "@shared/schema";

/** Query publik selalu ambil data terbaru dari database saat halaman dibuka. */
export const whatsOnPublicQueryOptions = {
  staleTime: 30_000,
  refetchOnMount: true as const,
};

export function normalizeArticleSlug(slug: string) {
  return decodeURIComponent(slug).trim().toLowerCase();
}

export function whatsOnListQueryKey() {
  return ["/api/whats-on/articles"] as const;
}

export function whatsOnDetailQueryKey(slug: string) {
  return [`/api/whats-on/articles/${normalizeArticleSlug(slug)}`] as const;
}

export function formatArticleDate(publishedAt: string, lang: "ID" | "EN") {
  return format(new Date(`${publishedAt}T00:00:00`), "d MMMM yyyy", {
    locale: lang === "ID" ? idLocale : enUS,
  });
}

export function articleTitle(article: WhatsOnArticle, lang: "ID" | "EN") {
  return lang === "ID" ? article.titleId : article.titleEn;
}

export function articleExcerpt(article: WhatsOnArticle, lang: "ID" | "EN") {
  return lang === "ID" ? article.excerptId : article.excerptEn;
}

export function articleContent(article: WhatsOnArticle, lang: "ID" | "EN") {
  return lang === "ID" ? article.contentId : article.contentEn;
}

export function articleCategory(article: WhatsOnArticle, lang: "ID" | "EN") {
  return lang === "ID" ? article.categoryId : article.categoryEn;
}
