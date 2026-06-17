import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSiteLanguage } from "@/lib/language";
import {
  articleCategory,
  articleContent,
  articleExcerpt,
  articleTitle,
  formatArticleDate,
  normalizeArticleSlug,
  whatsOnDetailQueryKey,
  whatsOnPublicQueryOptions,
} from "@/lib/whats-on";
import type { WhatsOnArticle } from "@shared/schema";

interface ArticleDetailPageProps {
  articleSlug: string;
}

export default function ArticleDetailPage({ articleSlug }: ArticleDetailPageProps) {
  const { lang } = useSiteLanguage();
  const slug = normalizeArticleSlug(articleSlug);

  const { data, isLoading, isError } = useQuery<{ success: boolean; article: WhatsOnArticle }>({
    queryKey: whatsOnDetailQueryKey(slug),
    enabled: Boolean(slug),
    ...whatsOnPublicQueryOptions,
  });

  const article = data?.article;

  if (isLoading) {
    return (
      <PublicPageLayout>
        <SEOHead pageKey="whatsOn" />
        <div className="px-4 py-20 text-center text-muted-foreground">
          {lang === "ID" ? "Memuat artikel..." : "Loading article..."}
        </div>
      </PublicPageLayout>
    );
  }

  if (isError || !article) {
    return (
      <PublicPageLayout>
        <SEOHead pageKey="notFound" />
        <div className="px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">
            {lang === "ID" ? "Artikel tidak ditemukan" : "Article not found"}
          </h1>
          <Link href="/whats-on">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === "ID" ? "Kembali ke Kabar Terkini" : "Back to What's On"}
            </Button>
          </Link>
        </div>
      </PublicPageLayout>
    );
  }

  const paragraphs = articleContent(article, lang)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <PublicPageLayout>
      <SEOHead pageKey="whatsOn" />

      <article className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/whats-on">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === "ID" ? "Kabar Terkini" : "What's On"}
            </Button>
          </Link>

          {article.imagePath ? (
            <img
              src={article.imagePath}
              alt=""
              className="mb-8 h-56 w-full rounded-xl object-cover sm:h-80"
            />
          ) : null}

          <p className="text-sm text-muted-foreground mb-2">
            {articleCategory(article, lang)} • {formatArticleDate(article.publishedAt, lang)}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-6">
            {articleTitle(article, lang)}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {articleExcerpt(article, lang)}
            </p>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
}
