import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Crown, Sparkles, Gem, UtensilsCrossed } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import AboutSlideshow from "@/components/AboutSlideshow";
import { contactByKey } from "@/lib/siteContent";
import { useSiteText } from "@/lib/siteText";
import aboutInterior from "@assets/about-interior_1781246285353.jpg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import image1 from "@assets/DSC07140_1758564407964.jpg";
import image2 from "@assets/DSC02436_1758564588903.jpg";
import image3 from "@assets/DSC02371_1758564588950.jpg";
import cikarangImg from "@assets/outlet-cikarang-1_1781246285353.jpg";
import bintaroImg from "@assets/outlet-bintaro-1_1781246285353.jpg";

const PILLAR_ICONS = [Gem, Sparkles, UtensilsCrossed] as const;

const STORY_IMAGE_ALTS = [
  "Hidangan nasi padang Gadang Barubah",
  "Presentasi masakan Padang Gadang Barubah",
  "Suasana restoran Gadang Barubah",
] as const;

export default function AboutPage() {
  const { t, tl } = useSiteText();

  const pillars = [
    {
      icon: PILLAR_ICONS[0],
      title: t("about.philosophy.1.title"),
      description: t("about.philosophy.1.description"),
    },
    {
      icon: PILLAR_ICONS[1],
      title: t("about.philosophy.2.title"),
      description: t("about.philosophy.2.description"),
    },
    {
      icon: PILLAR_ICONS[2],
      title: t("about.philosophy.3.title"),
      description: t("about.philosophy.3.description"),
    },
  ];

  const storySections = [
    { title: t("about.story.1.title"), body: t("about.story.1.body") },
    { title: t("about.story.2.title"), body: t("about.story.2.body") },
    { title: t("about.story.3.title"), body: t("about.story.3.body") },
    { title: t("about.story.4.title"), body: t("about.story.4.body") },
  ];

  const slideshowImages = [
    { src: image1, alt: STORY_IMAGE_ALTS[0], caption: t("about.table.caption1") },
    { src: image2, alt: STORY_IMAGE_ALTS[1], caption: t("about.table.caption2") },
    { src: image3, alt: STORY_IMAGE_ALTS[2], caption: t("about.table.caption3") },
  ];

  return (
    <PublicPageLayout>
      <SEOHead pageKey="about" />

      <section className="relative overflow-hidden bg-[#300505]">
        <div className="absolute inset-0 signature-menu-section-bg" aria-hidden />
        <div className="absolute inset-0">
          <img
            src={aboutInterior}
            alt="Interior Gadang Barubah"
            className="h-full w-full object-cover opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#300505]/80 via-[#300505]/60 to-[#300505]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
          <h1 className="mb-6 flex w-full justify-center">
            <img
              src={aboutTitle}
              alt="Gadang Barubah"
              className="h-auto w-full max-w-[min(85vw,420px)] brightness-0 invert"
              width={562}
              height={74}
              draggable={false}
            />
          </h1>
          <div className="section-divider mb-6" />
          <p className="max-w-md whitespace-pre-line text-balance text-base leading-relaxed text-white/85 sm:max-w-lg sm:text-lg">
            {t("about.hero.tagline")}
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-20 sm:space-y-24">
          <section>
            <div className="text-center mb-10">
              <h2 className="section-heading text-primary mb-4">{t("about.philosophy.title")}</h2>
              <div className="section-divider" />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="luxury-card border-gold/20 bg-card/80 text-center"
                >
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <pillar.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground">{pillar.title}</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-12">
            <div className="text-center">
              <h2 className="section-heading text-primary mb-4">{t("about.story.title")}</h2>
              <div className="section-divider" />
            </div>
            <div className="space-y-10">
              {storySections.map((section, idx) => (
                <div
                  key={section.title}
                  className={`flex flex-col gap-6 sm:gap-8 ${
                    idx % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
                  } sm:items-center`}
                >
                  <div className="sm:w-2/5 shrink-0">
                    <span className="font-heroCta text-xs uppercase tracking-[0.2em] text-gold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-serif text-xl sm:text-2xl font-medium text-foreground">
                      {section.title}
                    </h3>
                  </div>
                  <div className="sm:w-3/5">
                    <p className="whitespace-pre-line text-figma-body text-justify leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <AboutSlideshow
            images={slideshowImages}
            content={{
              title: t("about.table.title"),
              paragraphs: tl("about.table.paragraphs"),
            }}
            interval={5000}
          />

          <section id="outlet">
            <div className="text-center mb-8">
              <h2 className="section-heading text-primary mb-4">{t("about.visit.title")}</h2>
              <div className="section-divider mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">{t("about.visit.subtitle")}</p>
            </div>

            <div className="space-y-6">
              <Card className="overflow-hidden luxury-card border-gold/20">
                <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                  <img
                    src={cikarangImg}
                    alt="Outlet Gadang Barubah Pollux Mall Cikarang"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{t("about.visit.cikarang.name")}</p>
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {t("about.visit.cikarang.address")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <span>{t("about.visit.hours")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <a
                      href={`https://wa.me/${contactByKey("cikarang").whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {contactByKey("cikarang").name} — {contactByKey("cikarang").display}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Crown className="h-5 w-5 text-primary shrink-0" />
                    <span>{t("about.visit.cikarang.vip")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden luxury-card border-gold/20">
                <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                  <img
                    src={bintaroImg}
                    alt="Outlet Gadang Barubah Bintaro"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{t("about.visit.bintaro.name")}</p>
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {t("about.visit.bintaro.address")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <span>{t("about.visit.hours")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <a
                      href={`https://wa.me/${contactByKey("bintaro").whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {contactByKey("bintaro").name} — {contactByKey("bintaro").display}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Link href="/services/outlet">
                <Button className="mt-2">{t("about.visit.detailButton")}</Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
