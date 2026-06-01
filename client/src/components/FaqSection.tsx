import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

interface FaqSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function FaqSection({
  id = "faq-section",
  title = "Pertanyaan yang Sering Diajukan",
  subtitle = "Temukan jawaban seputar layanan, reservasi, dan outlet Gadang Barubah.",
  showViewAll = false,
}: FaqSectionProps) {
  const { lang } = useSiteLanguage();
  const items = showViewAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, 4);

  return (
    <section id={id} className="scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
          {title}
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {lang === "ID"
            ? subtitle
            : "Find answers about services, reservations, and Gadang Barubah outlets."}
        </p>
      </div>

      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
