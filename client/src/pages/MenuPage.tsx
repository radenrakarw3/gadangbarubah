import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { useSiteLanguage } from "@/lib/language";
import type { MenuCategory, MenuItem } from "@shared/schema";
import menuPdf from "@assets/Menu Gadang Digital 5 September 2025_1758627992252.pdf";

type PublicMenuCategory = MenuCategory & { items: MenuItem[] };

export default function MenuPage() {
  const { lang } = useSiteLanguage();

  const { data, isLoading } = useQuery<{
    success: boolean;
    categories: PublicMenuCategory[];
  }>({
    queryKey: ["/api/menu"],
  });

  const categories = (data?.categories ?? []).filter((cat) => cat.items.length > 0);

  return (
    <PublicPageLayout>
      <SEOHead pageKey="menu" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              Menu
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {lang === "ID"
                ? "Jelajahi koleksi hidangan autentik Padang kami — dari rendang signature hingga paket praktis untuk dibawa pulang."
                : "Explore our authentic Padang dishes — from signature rendang to practical takeaway packages."}
            </p>
          </section>

          {isLoading && (
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-[8/5] w-full" />
                  <CardContent className="p-5 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {lang === "ID"
                ? "Menu sedang disiapkan. Silakan lihat menu digital lengkap di bawah."
                : "Menu is being prepared. Please see the complete digital menu below."}
            </p>
          )}

          {categories.map((category) => (
            <section key={category.id}>
              <h2 className="text-2xl font-serif font-medium text-center mb-8">
                {lang === "ID" ? category.nameId : category.nameEn}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {category.items.map((item) => {
                  const name = lang === "ID" ? item.nameId : item.nameEn;
                  const description = lang === "ID" ? item.descriptionId : item.descriptionEn;
                  return (
                    <Card
                      key={item.id}
                      className="border-border/30 hover-elevate transition-shadow overflow-hidden"
                    >
                      <div className="aspect-[8/5] bg-muted">
                        <img
                          src={item.imagePath}
                          alt={name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{name}</h3>
                          {item.tag && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}

          <section>
            <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-medium mb-4">
                  {lang === "ID" ? "Menu Digital Lengkap" : "Complete Digital Menu"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  {lang === "ID"
                    ? "Lihat menu digital dengan harga terbaru dan pilihan lengkap masakan Minang tradisional."
                    : "See our digital menu with latest prices and complete traditional Minang selections."}
                </p>
                <Button asChild size="lg">
                  <a href={menuPdf} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-5 w-5" />
                    {lang === "ID" ? "Buka Menu PDF" : "Open Menu PDF"}
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground/80 mt-4">
                  {lang === "ID"
                    ? "Update September 2025 • Kompatibel semua perangkat"
                    : "Updated September 2025 • Compatible with all devices"}
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
