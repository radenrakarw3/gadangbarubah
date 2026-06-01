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
      className="relative bg-[#f5ebe6] scroll-mt-20 sm:scroll-mt-24 overflow-hidden"
    >
      {/* Mobile / tablet: stack */}
      <div className="lg:hidden">
        <div className="relative h-[32vh] min-h-[200px] max-h-[280px] overflow-hidden sm:h-[42vh] sm:max-h-none sm:min-h-[280px]">
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
        <div className="px-4 py-8 sm:px-8 sm:py-12">
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
      <div className="hidden lg:block relative h-[900px] max-w-[1920px] mx-auto">
        <div className="absolute left-0 top-0 w-[800px] h-[900px] overflow-hidden">
          <img
            src={aboutImage}
            alt="Interior Gadang Barubah"
            className="absolute left-0 top-[-174px] w-[800px] h-[1200px] max-w-none object-cover object-center"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div
            className="absolute left-0 top-[-174px] w-[800px] h-[1200px] bg-black/[0.13] pointer-events-none"
            aria-hidden
          />
        </div>

        <div className="absolute left-[800px] right-0 top-0 h-[900px]">
          <h2 className="absolute top-[213px] left-[83px] w-[564px] max-w-[564px]">
            <AboutTitleGraphic />
          </h2>

          <p
            className="text-figma-body absolute right-[154px] w-[768px] max-w-[calc(100%-237px)] text-black"
            style={{ top: "calc(50% - 130px + 22px)" }}
          >
            {ABOUT_COPY[lang]}
          </p>

          <button
            type="button"
            onClick={() => navigate("/about")}
            className="absolute right-[154px] top-[661px] flex h-[60px] w-[215px] items-center justify-between rounded-lg bg-[#3F0000] px-6 font-heroCta text-[18px] font-medium italic leading-[50px] tracking-[0.03em] text-white hover:bg-[#520000] transition-colors"
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
