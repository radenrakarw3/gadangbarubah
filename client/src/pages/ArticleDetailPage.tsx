import { Link } from "wouter";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import FaqSection from "@/components/FaqSection";
import { ARTICLES } from "@/lib/siteContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ArticleDetailPageProps {
  articleId: string;
}

export default function ArticleDetailPage({ articleId }: ArticleDetailPageProps) {
  const article = ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <PublicPageLayout>
        <SEOHead pageKey="notFound" />
        <div className="px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">Artikel tidak ditemukan</h1>
          <Link href="/whats-on">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke What's On
            </Button>
          </Link>
        </div>
      </PublicPageLayout>
    );
  }

  return (
    <PublicPageLayout>
      <SEOHead pageKey="whatsOn" />

      <article className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/whats-on">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              What's On
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mb-2">
            {article.category} • {article.date}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-6">
            {article.title}
          </h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>
            <p className="text-muted-foreground leading-relaxed">
              Artikel lengkap akan segera tersedia. Untuk informasi lebih lanjut tentang{" "}
              {article.category.toLowerCase()} Gadang Barubah, hubungi kami via WhatsApp di{" "}
              <a
                href="https://wa.me/6289509766739"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                089509766739
              </a>
              .
            </p>
          </div>
        </div>
      </article>
    </PublicPageLayout>
  );
}
