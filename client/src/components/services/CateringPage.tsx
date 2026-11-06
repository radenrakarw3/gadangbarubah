import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  ChefHat,
  Clock3,
  MapPin,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "wouter";
import PublicPageLayout from "../PublicPageLayout";
import SEOHead from "../SEOHead";
import { COMPANY, FROZEN_FOOD_LINKTREE, contactByKey } from "@/lib/siteContent";
import { useSiteText } from "@/lib/siteText";
import type { SiteTextKey } from "@shared/site-text-registry";

const WHY_ICONS = [ShieldCheck, Clock3, ChefHat, CheckCircle2] as const;

const SERVICE_KEYS = [
  "mealbox",
  "buffet",
  "snackbox",
  "stall",
  "home-delivery",
] as const;

export default function CateringPage() {
  const { t, tl } = useSiteText();
  const b2b = contactByKey("acara");
  const waConsultHref = `https://wa.me/${COMPANY.cateringWhatsapp}?text=${encodeURIComponent(
    `Halo ${b2b.name}, saya ingin konsultasi katering/acara Gadang Barubah.`,
  )}`;

  const whyItems = [1, 2, 3, 4].map((n, i) => ({
    icon: WHY_ICONS[i],
    title: t(`catering.why.${n}.title` as SiteTextKey),
    desc: t(`catering.why.${n}.desc` as SiteTextKey),
  }));

  const packages = [1, 2, 3].map((n) => ({
    name: t(`catering.packages.${n}.name` as SiteTextKey),
    minOrder: t(`catering.packages.${n}.minOrder` as SiteTextKey),
    price: t(`catering.packages.${n}.price` as SiteTextKey),
    includes: tl(`catering.packages.${n}.includes` as SiteTextKey),
  }));

  const menuCategories = [1, 2, 3, 4].map((n) => ({
    category: t(`catering.menu.${n}.category` as SiteTextKey),
    items: tl(`catering.menu.${n}.items` as SiteTextKey),
  }));

  const bookingSteps = [1, 2, 3, 4].map((n) => ({
    title: t(`catering.booking.${n}.title` as SiteTextKey),
    desc: t(`catering.booking.${n}.desc` as SiteTextKey),
  }));

  const services = SERVICE_KEYS.map((id) => ({
    id,
    name: t(`home.services.${id}.name` as SiteTextKey),
    description: t(`home.services.${id}.description` as SiteTextKey),
  }));

  return (
    <PublicPageLayout>
      <SEOHead pageKey="catering" />

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-foreground sm:text-4xl">
              {t("catering.hero.title")}
            </h1>
            <div className="mx-auto mb-6 h-px w-24 bg-primary" />
            <p className="mx-auto max-w-2xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
              {t("catering.hero.subtitle")}
            </p>
          </div>

          <section>
            <h2 className="mb-6 text-center font-serif text-2xl font-medium">
              {t("catering.why.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whyItems.map((item) => (
                <Card key={item.title} className="border-border/40">
                  <CardContent className="space-y-3 p-5 text-center">
                    <item.icon className="mx-auto h-6 w-6 text-primary" />
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-center font-serif text-2xl font-medium">
              {t("home.catering.collageTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="border-border/40">
                  <CardContent className="flex h-full flex-col p-5">
                    <h3 className="font-serif text-xl font-medium text-foreground">
                      {service.name}
                    </h3>
                    <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-border/40">
                <CardContent className="flex h-full flex-col p-5">
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    {t("home.services.rental-room.name")}
                  </h3>
                  <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {t("home.services.rental-room.description")}
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href={FROZEN_FOOD_LINKTREE} target="_blank" rel="noopener noreferrer">
                      Linktree
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-center font-serif text-2xl font-medium">
              {t("catering.packages.title")}
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Card key={pkg.name} className="border-border/40">
                  <CardContent className="flex h-full flex-col space-y-3 p-5">
                    <h3 className="font-serif text-xl font-medium">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("catering.packages.minOrderLabel")} {pkg.minOrder}
                    </p>
                    <p className="font-medium text-primary">{pkg.price}</p>
                    <div>
                      <p className="mb-1 text-sm font-medium">
                        {t("catering.packages.includesLabel")}
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {pkg.includes.map((line) => (
                          <li key={line}>• {line}</li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild className="mt-auto">
                      <a href={waConsultHref} target="_blank" rel="noopener noreferrer">
                        {t("catering.packages.orderButton")}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-center font-serif text-2xl font-medium">
              {t("catering.venue.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border/40">
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {t("catering.venue.onsite.title")}
                  </div>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {t("catering.venue.onsite.desc")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/40">
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center gap-2 font-medium">
                    <UtensilsCrossed className="h-4 w-4 text-primary" />
                    {t("catering.venue.offsite.title")}
                  </div>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {t("catering.venue.offsite.desc")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-center font-serif text-2xl font-medium">
              {t("catering.menu.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {menuCategories.map((cat) => (
                <Card key={cat.category} className="border-border/40">
                  <CardContent className="space-y-3 p-5">
                    <h3 className="font-medium text-primary">{cat.category}</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {cat.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="space-y-5 p-6">
              <h3 className="flex items-center justify-center gap-2 text-center text-xl font-semibold">
                <Calendar className="h-5 w-5" />
                {t("catering.booking.title")}
              </h3>
              <ol className="mx-auto max-w-xl space-y-3 text-sm text-muted-foreground">
                {bookingSteps.map((step, idx) => (
                  <li key={step.title}>
                    <span className="font-medium text-foreground">
                      {idx + 1}. {step.title}
                    </span>
                    {" — "}
                    {step.desc}
                  </li>
                ))}
              </ol>
              <p className="text-center text-sm text-muted-foreground">{t("catering.booking.note")}</p>
              <div className="rounded-lg bg-card p-4 text-center text-sm">
                <p className="font-medium">{t("catering.contact.title")}</p>
                <div className="mt-2 space-y-1 whitespace-pre-line text-muted-foreground">
                  {tl("catering.contact.lines").join("\n")}
                </div>
                <p className="mt-3 font-medium">
                  {b2b.name} — {b2b.display}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <a href={waConsultHref} target="_blank" rel="noopener noreferrer">
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                    {t("catering.contact.consultButton")}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#catering-inquiry-section">{t("catering.contact.priceListButton")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageLayout>
  );
}
