import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Crown, Sparkles, Gem, UtensilsCrossed } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import AboutSlideshow from "@/components/AboutSlideshow";
import { useSiteText } from "@/lib/siteText";
import aboutInterior from "@assets/about-interior_1781246285353.jpg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import image1 from "@assets/DSC07140_1758564407964.jpg";
import image2 from "@assets/DSC02436_1758564588903.jpg";
import image3 from "@assets/DSC02371_1758564588950.jpg";
import cikarangImg from "@assets/outlet-cikarang-1_1781246285353.jpg";
import bintaroImg from "@assets/outlet-bintaro-1_1781246285353.jpg";

const storyImages = [
  { src: image1, alt: "Hidangan nasi padang Gadang Barubah", captionKey: "about.table.caption1" },
  { src: image2, alt: "Presentasi masakan Padang Gadang Barubah", captionKey: "about.table.caption2" },
  { src: image3, alt: "Suasana restoran Gadang Barubah", captionKey: "about.table.caption3" },
] as const;

const LUXURY_PILLARS = [
  { icon: Gem, n: 1 },
  { icon: Sparkles, n: 2 },
  { icon: UtensilsCrossed, n: 3 },
] as const;

const STORY_SECTION_NUMBERS = [1, 2, 3, 4] as const;

export default function AboutPage() {
  const { t, tl } = useSiteText();
  const pillars = LUXURY_PILLARS.map((pillar) => ({
    icon: pillar.icon,
    title: t(`about.philosophy.${pillar.n}.title`),
    description: t(`about.philosophy.${pillar.n}.description`),
  }));
  const storySections = STORY_SECTION_NUMBERS.map((n) => ({
    title: t(`about.story.${n}.title`),
    body: t(`about.story.${n}.body`),
  }));

  return (
    <PublicPageLayout>
      <SEOHead pageKey="about" />

      {/* Hero — restoran kelas dunia */}
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

          {/* Tiga pilar kemewahan */}
          <section>
            <div className="text-center mb-10">
              <h2 className="section-heading text-primary mb-4">
                {t("about.philosophy.title")}
              </h2>
              <div className="section-divider" />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar, idx) => (
                <Card
                  key={idx}
                  className="luxury-card border-gold/20 bg-card/80 text-center"
                >
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <pillar.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Narasi cerita — dikembangkan dari teks asli */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="section-heading text-primary mb-4">
                {t("about.story.title")}
              </h2>
              <div className="section-divider" />
            </div>
            <div className="space-y-10">
              {storySections.map((section, idx) => (
                <div
                  key={idx}
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
                    <p className="text-figma-body whitespace-pre-line text-justify leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Slideshow visual */}
          <AboutSlideshow
            images={storyImages.map((img) => ({
              src: img.src,
              alt: img.alt,
              caption: t(img.captionKey),
            }))}
            content={{
              title: t("about.table.title"),
              paragraphs: tl("about.table.paragraphs"),
            }}
            interval={5000}
          />

          {/* Outlet */}
          <section id="outlet">
            <div className="text-center mb-8">
              <h2 className="section-heading text-primary mb-4">
                {t("about.visit.title")}
              </h2>
              <div className="section-divider mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                {t("about.visit.subtitle")}
              </p>
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
                      href="https://wa.me/6289509766739"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      089509766739
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
                      href="https://wa.me/6289509766739"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      089509766739
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Link href="/services/outlet">
                <Button className="mt-2">
                  {t("about.visit.detailButton")}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
