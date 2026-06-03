import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CATERING_TYPES, COMPANY } from "@/lib/siteContent";
import cateringImage from "@assets/DSC07153_1758564588952.jpg";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import PrivacyConsentField from "@/components/PrivacyConsentField";

/** Field abu — sesuai mockup Figma catering */
const FIGMA_CATERING_FIELD =
  "h-11 min-w-0 w-full rounded-lg border-0 bg-[#a3a3a3] font-[var(--font-form)] text-xs font-normal italic tracking-[0.03em] text-white shadow-none " +
  "text-center placeholder:text-white/90 placeholder:italic placeholder:text-center placeholder:text-xs " +
  "focus-visible:ring-1 focus-visible:ring-[#3F0000]/35 focus-visible:ring-offset-0 " +
  "2xl:h-12 2xl:text-sm 2xl:placeholder:text-sm";

const FIGMA_CATERING_SELECT = cn(
  FIGMA_CATERING_FIELD,
  "justify-center text-center [&>span]:w-full [&>span]:text-center [&>span]:text-white [&>span]:line-clamp-1 [&_svg]:text-white/70",
);

const FIGMA_SELECT_MENU =
  "z-[120] max-h-60 overflow-y-auto rounded-lg border border-black/10 bg-[#3a3a3a] text-white shadow-xl";

const FIGMA_SELECT_ITEM = "rounded-md focus:bg-white/15 focus:text-white data-[highlighted]:bg-white/15";

function CateringForm({
  form,
  setForm,
  copy,
  loading,
  onSubmit,
  privacyAccepted,
  onPrivacyChange,
  lang,
  className,
}: {
  form: { nama: string; telepon: string; email: string; tipe: string; pax: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  copy: Record<string, string>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  privacyAccepted: boolean;
  onPrivacyChange: (v: boolean) => void;
  lang: "ID" | "EN";
  className?: string;
}) {
  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <header className="mb-6 text-center sm:mb-8 2xl:mb-10">
        <h2 className="font-[var(--font-inquiry)] text-[clamp(1.35rem,1.9vw,2.125rem)] font-medium leading-[1.2] tracking-[0.01em] text-black">
          {copy.title}
        </h2>
        <p className="mx-auto mt-2.5 max-w-[420px] font-[var(--font-inquiry)] text-xs leading-[1.55] text-black sm:text-[13px] sm:leading-[1.6] 2xl:mt-3 2xl:text-sm">
          {copy.subtitle}
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:gap-3 2xl:grid-cols-2 2xl:gap-3.5">
        <Input
          id="catering-nama"
          placeholder={copy.nama}
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          autoComplete="name"
          className={FIGMA_CATERING_FIELD}
        />
        <Input
          id="catering-telepon"
          placeholder={copy.telepon}
          value={form.telepon}
          onChange={(e) => setForm({ ...form, telepon: e.target.value })}
          autoComplete="tel"
          className={FIGMA_CATERING_FIELD}
        />
        <Input
          id="catering-email"
          type="email"
          placeholder={copy.email}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          className={FIGMA_CATERING_FIELD}
        />
        <Select value={form.tipe} onValueChange={(v) => setForm({ ...form, tipe: v })}>
          <SelectTrigger className={FIGMA_CATERING_SELECT} aria-label={copy.service}>
            <SelectValue placeholder={copy.service} />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6} className={FIGMA_SELECT_MENU}>
            {CATERING_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value} className={FIGMA_SELECT_ITEM}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="catering-pax"
          type="number"
          min={10}
          placeholder={copy.pax}
          value={form.pax}
          onChange={(e) => setForm({ ...form, pax: e.target.value })}
          className={FIGMA_CATERING_FIELD}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "h-11 min-w-0 w-full rounded-lg border-0 bg-[#3F0000] px-3 font-heroCta text-xs font-bold italic tracking-[0.03em] text-white shadow-none",
            "transition-colors hover:bg-[#520000] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3F0000]/40",
            "disabled:opacity-70 2xl:h-12 2xl:px-4 2xl:text-sm",
          )}
        >
          {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : copy.submit}
        </button>
      </div>

      <PrivacyConsentField
        checked={privacyAccepted}
        onCheckedChange={onPrivacyChange}
        lang={lang}
        id="catering-privacy-consent"
        compact
        className="mx-auto mt-4 max-w-md justify-center sm:mt-5"
      />
    </form>
  );
}

export default function CateringInquirySection() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    tipe: CATERING_TYPES[0].value as string,
    pax: "50",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const copy = {
    title: lang === "ID" ? "Rencanakan Katering Anda Bersama Kami" : "Plan Your Catering With Us",
    subtitle:
      lang === "ID"
        ? "Ceritakan kebutuhan acara Anda — tim kami siap menyesuaikan menu dan jumlah tamu."
        : "Tell us about your event — our team will tailor the menu and guest count for you.",
    nama: lang === "ID" ? "(Nama Anda)" : "(Your Name)",
    telepon: lang === "ID" ? "(No. Handphone)" : "(No. Handphone)",
    email: "(Email)",
    service: lang === "ID" ? "(Pilih Layanan)" : "(Choose Service)",
    pax: "(Pax)",
    submit: lang === "ID" ? "Reservasi Sekarang!" : "Reserve Now!",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      toast({
        title: lang === "ID" ? "Persetujuan diperlukan" : "Consent required",
        description:
          lang === "ID"
            ? "Centang Syarat & Ketentuan serta Kebijakan Privasi."
            : "Please accept the Terms and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    if (!form.nama.trim() || form.telepon.length < 10) {
      toast({
        title: lang === "ID" ? "Data belum lengkap" : "Incomplete data",
        description: lang === "ID" ? "Isi nama dan nomor telepon." : "Please fill in your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const tipeLabel = CATERING_TYPES.find((t) => t.value === form.tipe)?.label ?? form.tipe;
    const message = encodeURIComponent(
      lang === "ID"
        ? `Halo Gadang Barubah, saya ingin konsultasi catering:\n\nNama: ${form.nama}\nTelepon: ${form.telepon}\nEmail: ${form.email || "-"}\nTipe: ${tipeLabel}\nPax: ${form.pax}`
        : `Hello Gadang Barubah, I want to discuss catering:\n\nName: ${form.nama}\nPhone: ${form.telepon}\nEmail: ${form.email || "-"}\nType: ${tipeLabel}\nPax: ${form.pax}`,
    );
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${message}`, "_blank");
    toast({
      title: lang === "ID" ? "Membuka WhatsApp" : "Opening WhatsApp",
      description:
        lang === "ID" ? "Lanjutkan pesan catering di WhatsApp." : "Continue your catering message on WhatsApp.",
    });
    setLoading(false);
  };

  const formProps = {
    form,
    setForm,
    copy,
    loading,
    onSubmit: handleSubmit,
    privacyAccepted,
    onPrivacyChange: setPrivacyAccepted,
    lang,
  };

  return (
    <section
      id="catering-inquiry-section"
      className="relative scroll-mt-20 overflow-hidden bg-[#DBDBDB] sm:scroll-mt-24"
    >
      <div className="xl:hidden">
        <div className="px-4 py-10 sm:px-8 sm:py-14">
          <CateringForm {...formProps} className="mx-auto max-w-[520px]" />
        </div>
        <div className="relative h-[300px] overflow-hidden sm:h-[400px]">
          <img
            src={cateringImage}
            alt="Layanan catering Gadang Barubah"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      {/* Desktop — form kiri, foto kanan fixed (tidak melebar di layar besar) */}
      <div className="mx-auto hidden w-full max-w-[1920px] xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-stretch xl:min-h-[min(720px,88svh)]">
        <div className="flex min-w-0 items-center justify-center bg-[#DBDBDB] px-6 py-10 xl:min-h-[480px] xl:px-8 xl:py-12 2xl:px-[clamp(2rem,5vw,80px)] 2xl:py-[clamp(3rem,6vh,4.5rem)]">
          <CateringForm {...formProps} className="w-full min-w-0 max-w-[min(100%,480px)] 2xl:max-w-[520px]" />
        </div>

        <div className="relative ml-auto aspect-[4/5] h-auto w-[clamp(280px,32vw,440px)] max-h-[min(500px,72svh)] shrink-0 overflow-hidden bg-neutral-900 xl:justify-self-end">
          <img
            src={cateringImage}
            alt="Layanan catering Gadang Barubah"
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
