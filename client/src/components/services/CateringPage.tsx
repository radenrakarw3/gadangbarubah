import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, UtensilsCrossed } from "lucide-react";
import { Link } from "wouter";
import PublicPageLayout from "../PublicPageLayout";
import SEOHead from "../SEOHead";
import { COMPANY, HOME_CATERING_SERVICES, contactByKey } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

export default function CateringPage() {
  const { lang } = useSiteLanguage();
  const b2b = contactByKey("acara");
  const waConsultHref = `https://wa.me/${COMPANY.cateringWhatsapp}?text=${encodeURIComponent(
    lang === "ID"
      ? "Halo Richman Saputra (Sales B2B Gadang Barubah), saya ingin konsultasi katering/acara."
      : "Hello Richman Saputra (GB B2B Sales), I'd like to discuss catering/events.",
  )}`;

  const services = HOME_CATERING_SERVICES.filter((s) => !("externalHref" in s && s.externalHref));

  return (
    <PublicPageLayout>
      <SEOHead pageKey="catering" />

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              {lang === "ID"
                ? "Katering & Acara Gadang Barubah"
                : "Gadang Barubah Catering & Events"}
            </h1>
            <div className="mx-auto mb-6 h-px w-24 bg-primary" />
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {lang === "ID"
                ? "Layanan katering Padang untuk pernikahan, corporate, gathering, dan acara outdoor — didukung outlet Cikarang & Bintaro serta Sales B2B."
                : "Padang catering for weddings, corporate events, gatherings, and outdoor occasions — supported by Cikarang & Bintaro outlets and B2B Sales."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="border-border/40">
                <CardContent className="flex h-full flex-col p-5">
                  <h2 className="font-serif text-xl font-medium text-foreground">
                    {lang === "ID" ? service.nameID : service.nameEN}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {lang === "ID" ? service.descriptionID : service.descriptionEN}
                  </p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-border/40">
              <CardContent className="flex h-full flex-col p-5">
                <h2 className="font-serif text-xl font-medium text-foreground">Frozen Food</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {lang === "ID"
                    ? "Produk beku siap saji — pesan melalui Linktree e-commerce kami."
                    : "Ready-to-cook frozen products — order via our e-commerce Linktree."}
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <a
                    href="https://linktr.ee/gadangbarubahindonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === "ID" ? "Buka Linktree" : "Open Linktree"}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="space-y-5 p-6">
              <h3 className="flex items-center justify-center gap-2 text-center text-xl font-semibold">
                <Calendar className="h-5 w-5" />
                {lang === "ID" ? "Cara Memesan" : "How to Order"}
              </h3>
              <ol className="mx-auto max-w-xl space-y-3 text-sm text-muted-foreground">
                <li>1. {lang === "ID" ? "Pilih jenis layanan di beranda atau chat Sales B2B." : "Choose a service on the homepage or chat B2B Sales."}</li>
                <li>2. {lang === "ID" ? "Isi form acara — data tersimpan di sistem kami." : "Fill the event form — your request is saved in our system."}</li>
                <li>3. {lang === "ID" ? "Lanjutkan konfirmasi via WhatsApp dengan link bukti status." : "Continue confirmation on WhatsApp with a status proof link."}</li>
              </ol>
              <div className="rounded-lg bg-card p-4 text-center text-sm">
                <p className="text-muted-foreground">
                  {lang === "ID" ? "Kontak Sales B2B" : "B2B Sales contact"}
                </p>
                <p className="mt-1 font-medium">
                  {b2b.name} — {b2b.display}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <a href={waConsultHref} target="_blank" rel="noopener noreferrer">
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    {lang === "ID" ? "Konsultasi Gratis" : "Free Consultation"}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#catering-inquiry-section">
                    {lang === "ID" ? "Isi Form Acara" : "Fill Event Form"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageLayout>
  );
}
