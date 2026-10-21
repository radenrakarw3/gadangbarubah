import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { useSiteLanguage } from "@/lib/language";
import { useSiteText } from "@/lib/siteText";
import {
  articleCategory,
  articleExcerpt,
  articleTitle,
  formatArticleDate,
  whatsOnListQueryKey,
  whatsOnPublicQueryOptions,
} from "@/lib/whats-on";
import type { WhatsOnArticle } from "@shared/schema";

export default function WhatsOnPage() {
  const { lang } = useSiteLanguage();
  const { t } = useSiteText();

  const { data, isLoading, isError } = useQuery<{ success: boolean; articles: WhatsOnArticle[] }>({
    queryKey: whatsOnListQueryKey(),
    ...whatsOnPublicQueryOptions,
  });

  const articles = data?.articles ?? [];

  return (
    <PublicPageLayout>
      <SEOHead pageKey="whatsOn" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              {t("whatsOn.title")}
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="whitespace-pre-line text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("whatsOn.subtitle")}
            </p>
          </section>

          {isLoading ? (
            <p className="text-center text-muted-foreground">
              {t("whatsOn.loadingList")}
            </p>
          ) : isError ? (
            <p className="text-center text-destructive">
              {t("whatsOn.errorList")}
            </p>
          ) : articles.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("whatsOn.empty")}
            </p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="border-border/30 hover-elevate transition-all group overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {article.imagePath ? (
                        <div className="sm:w-48 md:w-56 shrink-0">
                          <img
                            src={article.imagePath}
                            alt=""
                            className="h-44 w-full object-cover sm:h-full"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {articleCategory(article, lang)}
                            </Badge>
                            <span className="flex items-center text-xs text-muted-foreground gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatArticleDate(article.publishedAt, lang)}
                            </span>
                          </div>
                          <h2 className="text-xl font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                            {articleTitle(article, lang)}
                          </h2>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {articleExcerpt(article, lang)}
                          </p>
                        </div>
                        <Link
                          href={`/whats-on/${article.slug}`}
                          className="inline-flex items-center text-sm text-primary font-medium shrink-0"
                        >
                          {t("whatsOn.readMore")}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicPageLayout>
  );
}
