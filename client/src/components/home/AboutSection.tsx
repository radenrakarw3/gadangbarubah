import { memo } from "react";
import { useLocation } from "wouter";
import aboutImage from "@assets/DSC07220_1758565473982.jpg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import { useSiteLanguage } from "@/lib/language";

function AboutTitleGraphic() {
  return (
    <img
      src={aboutTitle}
      alt="Gadang Barubah"
      className="h-auto w-full max-w-[564px]"
      width={562}
      height={74}
      draggable={false}
    />
  );
}

/** Copy Figma Frame 5 — ID mengikuti teks desain */
const ABOUT_COPY = {
  ID: `Sudah sejak lama masakan Padang menjadi kecintaan banyak orang, bukan hanya di Ranah Minang, tetapi juga merasuk ke hati para perantau dan selebriti tanah air. Salah satunya adalah Deddy Corbuzier, yang berkali-kali mengungkapkan betapa lezatnya gulai, rendang, dan sambal lado hijau. Dari obrolan santai tentang cita rasa, lahirlah sebuah impian mendirikan rumah makan Padang yang tidak hanya memanjakan lidah, tetapi juga menjadi simbol inovasi. Impian itu bagaikan kabar baik yang terus disambut dari kecintaan Deddy pada masakan Minang, tercetuslah gagasan untuk menghadirkan Gadang Barubah. Bukan sekadar restoran, Gadang Barubah hadir untuk mengangkat warisan kuliner Minang ke tingkat yang lebih tinggi, memadukan resep turun-temurun dengan sentuhan modern, namun tetap berpijak pada cita rasa asli. Mulai dari rendang dengan bumbu kaya rasa, gulai yang harum menggoda, hingga hidangan daging spesial, setiap suapan menjadi perjalanan rasa dari Ranah Minang menuju hati dunia.`,
  EN: `For generations, Padang cuisine has been loved far beyond Minang land—by migrants and public figures across Indonesia. Deddy Corbuzier often spoke of his love for gulai, rendang, and green chili sambal. From those conversations came a dream: a Padang restaurant that delights the palate and stands for innovation. That dream became Gadang Barubah—not merely a restaurant, but a place to elevate Minang culinary heritage, blending time-honored recipes with a modern touch while staying true to authentic flavor. From richly spiced rendang and fragrant gulai to signature meat dishes, every bite is a journey from the Minang heartland to the world.`,
} as const;

function AboutSection() {
  const [, navigate] = useLocation();
  const { lang } = useSiteLanguage();
  const storyLabel = lang === "ID" ? "Cerita Kami" : "Our Story";

  return (
    <section
      id="about-section"
      className="relative bg-[#f5ebe6] scroll-mt-20 sm:scroll-mt-24 overflow-hidden pt-4 sm:pt-6 xl:pt-12"
    >
      <div className="xl:hidden">
        <div className="relative h-[28vh] min-h-[180px] max-h-[240px] overflow-hidden sm:h-[36vh] sm:max-h-[320px] sm:min-h-[240px]">
          <img
            src={aboutImage}
            alt="Interior Gadang Barubah"
            className="absolute inset-0 h-[115%] w-full object-cover object-center -top-[8%]"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/[0.13]" aria-hidden />
        </div>
        <div className="px-4 py-10 sm:px-8 sm:py-14">
          <h2 className="mb-4 max-w-[92vw] sm:mb-6">
            <AboutTitleGraphic />
          </h2>
          <p className="text-figma-body text-black">
            {ABOUT_COPY[lang]}
          </p>
          <button
            type="button"
            onClick={() => navigate("/about")}
            className="mt-6 inline-flex h-11 w-full max-w-[215px] items-center justify-between rounded-lg bg-[#3F0000] px-5 font-heroCta text-base font-medium italic tracking-[0.03em] text-white hover:bg-[#520000] transition-colors sm:mt-8 sm:h-[60px] sm:text-lg"
          >
            <span>{storyLabel}</span>
            <span className="w-[25px] border-t-2 border-white" aria-hidden />
          </button>
        </div>
      </div>

      {/* Desktop: layout absolut sesuai Figma (800px foto + panel kanan 900px) */}
      <div className="relative mx-auto hidden min-h-[min(820px,88svh)] max-w-[1920px] xl:grid xl:grid-cols-[minmax(0,680px)_1fr]">
        <div className="relative min-h-[560px] overflow-hidden">
          <img
            src={aboutImage}
            alt="Interior Gadang Barubah"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/[0.13] pointer-events-none" aria-hidden />
        </div>

        <div className="relative flex min-h-[560px] flex-col justify-center px-8 py-16 2xl:px-16 2xl:py-20">
          <h2 className="mb-8 w-full max-w-[564px]">
            <AboutTitleGraphic />
          </h2>

          <p className="text-figma-body max-w-[768px] text-black">
            {ABOUT_COPY[lang]}
          </p>

          <button
            type="button"
            onClick={() => navigate("/about")}
            className="mt-10 ml-auto inline-flex h-[52px] w-full max-w-[215px] items-center justify-between rounded-lg bg-[#3F0000] px-6 font-heroCta text-base font-medium italic tracking-[0.03em] text-white hover:bg-[#520000] transition-colors 2xl:h-[60px] 2xl:text-[18px]"
          >
            <span>{storyLabel}</span>
            <span className="w-[25px] border-t-2 border-white shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
