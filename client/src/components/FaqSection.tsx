import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSiteText } from "@/lib/siteText";

const FAQ_NUMBERS = [1, 2, 3, 4, 5, 6] as const;

interface FaqSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function FaqSection({
  id = "faq-section",
  title,
  subtitle,
  showViewAll = false,
}: FaqSectionProps) {
  const { t } = useSiteText();
  const numbers = showViewAll ? FAQ_NUMBERS : FAQ_NUMBERS.slice(0, 4);
  const items = numbers.map((n) => ({
    question: t(`faq.${n}.question`),
    answer: t(`faq.${n}.answer`),
  }));

  return (
    <section id={id} className="scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
          {title ?? t("faq.title")}
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
        <p className="whitespace-pre-line text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle ?? t("faq.subtitle")}
        </p>
      </div>

      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
