import { memo } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import aboutImage from "@assets/DSC07220_1758565473982.jpg";

function AboutSection() {
  const [, navigate] = useLocation();

  return (
    <section id="about-section" className="py-12 sm:py-20 bg-muted/30 scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          <div className="relative aspect-[16/11] sm:aspect-[3/4] home-img-wrap luxury-card rounded-none max-h-[280px] sm:max-h-none mx-auto w-full">
            <img
              src={aboutImage}
              alt="Interior Gadang Barubah — nuansa Minang yang mewah"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              draggable={false}
            />
            <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
          </div>

          <div className="lg:py-8">
            <p className="text-gold text-xs uppercase tracking-[0.25em] mb-4 font-medium">
              Tentang Kami
            </p>
            <h2 className="section-heading mb-6">Gadang Barubah</h2>
            <div className="section-divider ml-0 mr-auto mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Rumah makan Padang yang menghadirkan nasi padang autentik dan masakan Minang tradisional
                dengan standar kualitas tertinggi. Nama &ldquo;Gadang Barubah&rdquo; melambangkan semangat
                besar untuk terus berinovasi, tanpa meninggalkan akar tradisi yang kaya.
              </p>
              <p>
                Dari rendang daging yang mendunia, gulai kambing penuh rempah, hingga aneka lauk pauk
                segar khas Padang — disajikan dengan sentuhan kekinian yang menggugah selera dalam
                suasana bersantap yang hangat dan berkelas.
              </p>
            </div>
            <Button
              className="mt-6 sm:mt-8 w-full sm:w-auto rounded-none btn-reserve group h-11"
              onClick={() => navigate("/services/outlet")}
            >
              Our Outlet
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
