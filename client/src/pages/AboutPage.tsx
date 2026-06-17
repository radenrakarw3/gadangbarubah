import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Crown, Sparkles, Gem, UtensilsCrossed } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import AboutSlideshow from "@/components/AboutSlideshow";
import { useSiteLanguage } from "@/lib/language";
import aboutInterior from "@assets/about-interior_1781246285353.jpg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import image1 from "@assets/DSC07140_1758564407964.jpg";
import image2 from "@assets/DSC02436_1758564588903.jpg";
import image3 from "@assets/DSC02371_1758564588950.jpg";
import cikarangImg from "@assets/outlet-cikarang-1_1781246285353.jpg";
import bintaroImg from "@assets/outlet-bintaro-1_1781246285353.jpg";

const storyImages = [
  {
    src: image1,
    alt: "Hidangan nasi padang Gadang Barubah",
    captionID: "Rasa familiar dari Ranah Minang",
    captionEN: "Familiar flavors from Minang land",
  },
  {
    src: image2,
    alt: "Presentasi masakan Padang Gadang Barubah",
    captionID: "Disajikan dengan rapi",
    captionEN: "Thoughtfully presented",
  },
  {
    src: image3,
    alt: "Suasana restoran Gadang Barubah",
    captionID: "Suasana bersantap yang hangat",
    captionEN: "A warm dining atmosphere",
  },
];

const LUXURY_PILLARS = {
  ID: [
    {
      icon: Gem,
      title: "Rasa yang Asli",
      description:
        "Resep turun-temurun—rendang, gulai, sambal lado hijau—tetap kami masak dengan cara yang sama, dari bahan segar pilihan.",
    },
    {
      icon: Sparkles,
      title: "Sentuhan Kini",
      description:
        "Tradisi Minang yang kami hormati, dengan penyajian yang lebih rapi dan suasana yang nyaman untuk bersantap.",
    },
    {
      icon: UtensilsCrossed,
      title: "Suasana Bersantap",
      description:
        "Interior hangat dan pelayanan yang sopan, agar setiap kunjungan terasa istimewa tanpa perlu berlebihan.",
    },
  ],
  EN: [
    {
      icon: Gem,
      title: "Authentic Flavor",
      description:
        "Time-honored recipes—rendang, gulai, green chili sambal—cooked the same way, from fresh, carefully chosen ingredients.",
    },
    {
      icon: Sparkles,
      title: "A Gentle Modern Touch",
      description:
        "Minang tradition we respect, with neater presentation and a comfortable setting to dine in.",
    },
    {
      icon: UtensilsCrossed,
      title: "The Dining Room",
      description:
        "Warm interiors and courteous service, so every visit feels special without trying too hard.",
    },
  ],
} as const;

const STORY_SECTIONS = {
  ID: [
    {
      title: "Masakan yang Disukai Banyak Orang",
      body: "Sudah lama masakan Padang digemari, tidak hanya di Ranah Minang, tetapi juga di hati banyak perantau dan penggemar kuliner tanah air. Cita rasanya kaya, bumbunya berlapis, dan cara hidangnya khas—hal yang membuatnya begitu melekat di ingatan.",
    },
    {
      title: "Dari Obrolan tentang Rasa",
      body: "Deddy Corbuzier salah satunya—sering bercerita betapa ia menyukai gulai, rendang, dan sambal lado hijau. Dari obrolan santai tentang cita rasa itu, muncul impian sederhana: mendirikan rumah makan Padang yang enak, rapi, dan berkelas.",
    },
    {
      title: "Lahirnya Gadang Barubah",
      body: "Impian tersebut akhirnya terwujud dalam Gadang Barubah. Bukan sekadar tempat makan, melainkan ruang untuk menikmati masakan Minang dengan lebih nyaman—resep turun-temurun tetap dijaga, dengan sentuhan modern yang halus, namun tetap berpijak pada cita rasa asli.",
    },
    {
      title: "Sajian yang Kami Banggakan",
      body: "Mulai dari rendang berbumbu kaya, gulai yang harum, hingga hidangan daging pilihan—setiap suapan membawa rasa Ranah Minang yang familiar, dalam penyajian yang lebih tenang dan hangat.",
    },
  ],
  EN: [
    {
      title: "A Cuisine Many People Love",
      body: "For a long time, Padang food has been cherished—not only in Minang land, but also among migrants and food lovers across Indonesia. Its rich taste, layered spices, and distinctive serving style make it hard to forget.",
    },
    {
      title: "From a Conversation About Taste",
      body: "Deddy Corbuzier is one of them—often sharing how much he enjoys gulai, rendang, and green chili sambal. From those easy conversations about flavor came a simple dream: to open a Padang restaurant that is delicious, well-kept, and refined.",
    },
    {
      title: "The Birth of Gadang Barubah",
      body: "That dream became Gadang Barubah—not just a place to eat, but a space to enjoy Minang cuisine more comfortably. Time-honored recipes are still guarded, with a gentle modern touch, while staying true to authentic flavor.",
    },
    {
      title: "Dishes We Are Proud Of",
      body: "From richly spiced rendang and fragrant gulai to selected meat dishes—every bite carries the familiar taste of Minang land, in a calmer, warmer presentation.",
    },
  ],
} as const;

export default function AboutPage() {
  const { lang } = useSiteLanguage();
  const isID = lang === "ID";
  const pillars = LUXURY_PILLARS[lang];
  const storySections = STORY_SECTIONS[lang];

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
          <p className="max-w-md text-balance text-base leading-relaxed text-white/85 sm:max-w-lg sm:text-lg">
            {isID ? (
              <>
                Warisan rasa Minang yang kami jaga,
                <br />
                disajikan dengan tenang dan penuh perhatian.
              </>
            ) : (
              <>
                Minang flavors we hold dear,
                <br />
                served with quiet care and attention.
              </>
            )}
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-20 sm:space-y-24">

          {/* Tiga pilar kemewahan */}
          <section>
            <div className="text-center mb-10">
              <h2 className="section-heading text-primary mb-4">
                {isID ? "Filosofi Kami" : "Our Philosophy"}
              </h2>
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
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
                {isID ? "Cerita Kami" : "Our Story"}
              </h2>
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
                    <p className="text-figma-body text-justify leading-relaxed text-muted-foreground">
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
              caption: isID ? img.captionID : img.captionEN,
            }))}
            content={{
              title: isID ? "Di Meja Kami" : "At Our Table",
              paragraphs: isID
                ? [
                    "Setiap hidangan kami masak dari resep yang sudah lama ada—bahan segar, bumbu yang pas, tanpa mengubah cita rasa aslinya.",
                    "Dari dapur ke meja tamu, kami ingin Anda merasa nyaman dan dihargai.",
                  ]
                : [
                    "Every dish is cooked from recipes that have been around for a long time—fresh ingredients, balanced spices, without changing the original taste.",
                    "From kitchen to guest table, we want you to feel comfortable and well looked after.",
                  ],
            }}
            interval={5000}
          />

          {/* Outlet */}
          <section id="outlet">
            <div className="text-center mb-8">
              <h2 className="section-heading text-primary mb-4">
                {isID ? "Kunjungi Kami" : "Visit Us"}
              </h2>
              <div className="section-divider mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                {isID
                  ? "Kunjungi cabang kami di Cikarang dan Bintaro."
                  : "Visit our branches in Cikarang and Bintaro."}
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
                      <p className="font-medium text-foreground">Pollux Mall Cikarang</p>
                      <p className="text-sm leading-relaxed">
                        Main Gate, Mall Cikarang, Jl. Raya Cikarang - Cibarusah, Pasirsari,
                        Cikarang Sel., Kabupaten Bekasi, Jawa Barat 17530 — Lantai GF
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <span>{isID ? "Buka setiap hari: 10:00 – 22:00 WIB" : "Open daily: 10:00 – 22:00 WIB"}</span>
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
                    <span>
                      {isID
                        ? "VIP Private Room tersedia untuk acara spesial"
                        : "VIP Private Room available for special occasions"}
                    </span>
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
                      <p className="font-medium text-foreground">Bintaro (Jurang Mangu Barat)</p>
                      <p className="text-sm leading-relaxed">
                        Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren,
                        Kota Tangerang Selatan, Banten 15412
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <span>{isID ? "Buka setiap hari: 10:00 – 22:00 WIB" : "Open daily: 10:00 – 22:00 WIB"}</span>
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
                  {isID ? "Lihat Detail Outlet" : "View Outlet Details"}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
