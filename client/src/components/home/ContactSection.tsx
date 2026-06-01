import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

export default function ContactSection() {
  const { lang } = useSiteLanguage();

  return (
    <section
      id="contact-section"
      className="bg-[#f3efe8] py-10 scroll-mt-16 sm:scroll-mt-24 sm:py-16 lg:py-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="section-heading mb-4">{lang === "ID" ? "Hubungi Kami" : "Contact Us"}</h2>
        <div className="section-divider mb-5 sm:mb-6" />
        <p className="text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
          {lang === "ID"
            ? "Ada pertanyaan atau ingin konsultasi menu? Tim kami siap membantu via WhatsApp."
            : "Have questions or need menu recommendations? Our team is ready to help via WhatsApp."}
        </p>
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto rounded-none bg-[#25D366] hover:bg-[#20BA5A] text-white uppercase tracking-[0.1em] text-xs font-semibold px-8 h-12 sm:h-11"
        >
          <a
            href={
              lang === "ID"
                ? `https://wa.me/${COMPANY.whatsapp}?text=Halo%20Gadang%20Barubah!%20Saya%20ingin%20bertanya.`
                : `https://wa.me/${COMPANY.whatsapp}?text=Hello%20Gadang%20Barubah!%20I%20have%20a%20question.`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {lang === "ID" ? "Chat via WhatsApp" : "Chat on WhatsApp"}
          </a>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">{COMPANY.phoneDisplay}</p>
      </div>
    </section>
  );
}
