import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { SIGNATURE_MENU } from "@/lib/siteContent";
import menuPdf from "@assets/Menu Gadang Digital 5 September 2025_1758627992252.pdf";

export default function MenuPage() {
  return (
    <PublicPageLayout>
      <SEOHead pageKey="menu" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              Menu
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Jelajahi koleksi hidangan autentik Padang kami — dari rendang signature hingga paket
              praktis untuk dibawa pulang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium text-center mb-8">
              Menu Signature
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SIGNATURE_MENU.map((item) => (
                <Card key={item.name} className="border-border/30 hover-elevate transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {item.tag}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-medium mb-4">Menu Digital Lengkap</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Lihat menu digital dengan harga terbaru dan pilihan lengkap masakan Minang
                  tradisional.
                </p>
                <Button asChild size="lg">
                  <a href={menuPdf} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-5 w-5" />
                    Buka Menu PDF
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground/80 mt-4">
                  Update September 2025 • Kompatibel semua perangkat
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
