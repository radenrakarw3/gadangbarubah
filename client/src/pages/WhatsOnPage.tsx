import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { ARTICLES } from "@/lib/siteContent";

export default function WhatsOnPage() {
  return (
    <PublicPageLayout>
      <SEOHead pageKey="whatsOn" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              What's On
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berita, tips kuliner, dan update terbaru seputar Gadang Barubah Indonesia.
            </p>
          </section>

          <div className="space-y-4">
            {ARTICLES.map((article) => (
              <Card
                key={article.id}
                className="border-border/30 hover-elevate transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="flex items-center text-xs text-muted-foreground gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {article.date}
                        </span>
                      </div>
                      <h2 className="text-xl font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/whats-on/${article.id}`}
                      className="inline-flex items-center text-sm text-primary font-medium shrink-0"
                    >
                      Baca
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
