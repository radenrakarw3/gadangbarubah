import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CONTACTS, type SiteContact } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

function waHref(contact: SiteContact, lang: "ID" | "EN") {
  const label = lang === "ID" ? contact.labelID : contact.labelEN;
  const text = encodeURIComponent(
    lang === "ID"
      ? `Halo ${contact.name} (${label}), saya ingin bertanya.`
      : `Hello ${contact.name} (${label}), I have a question.`,
  );
  return `https://wa.me/${contact.whatsapp}?text=${text}`;
}

export function ContactChooserDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lang } = useSiteLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[220] max-w-md gap-0 overflow-hidden border-0 p-0 sm:rounded-xl">
        <DialogHeader className="border-b border-black/5 bg-[#FFF8F0] px-5 py-4 text-left">
          <DialogTitle className="font-heroCta text-lg text-[#3F0000]">
            {lang === "ID" ? "Hubungi Kami" : "Contact Us"}
          </DialogTitle>
          <DialogDescription className="font-heroCta text-sm text-black/55">
            {lang === "ID"
              ? "Pilih pihak yang ingin Anda hubungi."
              : "Choose who you would like to reach."}
          </DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-black/5 bg-white" data-testid="contact-chooser-list">
          {CONTACTS.map((contact) => (
            <li key={contact.key}>
              <a
                href={waHref(contact, lang)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onOpenChange(false)}
                className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[#FFF8F0]"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#590000]/10 text-[#590000] transition-colors group-hover:bg-[#590000] group-hover:text-[#FFEEDD]">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heroCta text-[11px] uppercase tracking-[0.14em] text-black/45">
                    {lang === "ID" ? contact.labelID : contact.labelEN}
                  </span>
                  <span className="mt-0.5 block font-heroCta text-base text-black">
                    {contact.name}
                  </span>
                  <span className="mt-1 block font-heroCta text-xs text-black/40">
                    WhatsApp
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

export function FooterContactCards({ className }: { className?: string }) {
  const { lang } = useSiteLanguage();

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
      data-testid="footer-contacts"
    >
      {CONTACTS.map((contact) => (
        <li key={contact.key} className="h-full">
          <a
            href={waHref(contact, lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full min-h-[132px] flex-col rounded-xl border border-black/8 bg-[#FFFCF8] px-4 py-4 transition-colors hover:border-[#590000]/25 hover:bg-[#FFF8F0]"
          >
            <p className="font-heroCta text-[11px] uppercase tracking-[0.14em] text-black/40">
              {lang === "ID" ? contact.labelID : contact.labelEN}
            </p>
            <p className="mt-2 font-heroCta text-base leading-snug text-black">
              {contact.name}
            </p>
            <p className="mt-auto pt-3 font-heroCta text-sm text-[#590000] group-hover:underline">
              {lang === "ID" ? "Chat WhatsApp →" : "WhatsApp chat →"}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
