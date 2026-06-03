import { useState, type ReactNode } from "react";
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

const CATERING_FIELD =
  "h-11 sm:h-[52px] lg:h-14 w-full rounded-lg border border-[#3F0000]/14 bg-white px-3.5 sm:px-4 font-[var(--font-form)] text-[15px] sm:text-base text-[#1a0a0a] shadow-[0_2px_10px_-4px_rgba(63,0,0,0.14)] " +
  "placeholder:text-[#7a5c5c]/65 placeholder:italic placeholder:text-[15px] sm:placeholder:text-base placeholder:tracking-[0.03em] " +
  "focus-visible:border-[#3F0000]/40 focus-visible:ring-2 focus-visible:ring-[#3F0000]/12 focus-visible:ring-offset-0";

const CATERING_SELECT = cn(
  CATERING_FIELD,
  "text-left [&>span]:text-[#1a0a0a] [&>span]:line-clamp-1 [&_svg]:text-[#3F0000]/45",
);

const CATERING_SELECT_MENU =
  "z-[120] max-h-60 overflow-y-auto rounded-lg border border-[#3F0000]/12 bg-white text-[#1a0a0a] shadow-[0_16px_40px_-12px_rgba(63,0,0,0.22)]";

const CATERING_SELECT_ITEM =
  "rounded-md text-[#1a0a0a] focus:bg-[#3F0000]/8 focus:text-[#3F0000] data-[highlighted]:bg-[#3F0000]/8";

function CateringField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block font-[var(--font-form)] text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.08em] text-[#3F0000]/80"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

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
      <header className="mb-5 sm:mb-6 lg:mb-8 max-w-[541px] lg:ml-auto lg:text-right lg:mr-0">
        <p className="mb-1.5 sm:mb-2 font-[var(--font-form)] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5a3c]">
          {copy.eyebrow}
        </p>
        <h2 className="text-figma-inquiry-title text-[#3F0000]">
          {copy.title}
        </h2>
        <p className="mt-2 sm:mt-3 font-[var(--font-form)] text-sm sm:text-base leading-relaxed text-[#5c4040]/90 lg:ml-auto lg:max-w-[480px]">
          {copy.subtitle}
        </p>
      </header>

      <div
        className={cn(
          "relative max-w-[651px] overflow-hidden rounded-xl sm:rounded-2xl border border-[#3F0000]/10",
          "bg-gradient-to-br from-[#FFF8F0] via-[#FFF5F0] to-[#FFF0E8]",
          "p-4 sm:p-6 lg:p-8 shadow-[0_16px_40px_-20px_rgba(63,0,0,0.25)] sm:shadow-[0_24px_60px_-28px_rgba(63,0,0,0.28)]",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-transparent before:via-[#C9A227]/70 before:to-transparent",
        )}
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 xl:gap-x-8 lg:gap-y-6">
          <CateringField label={copy.labelNama} htmlFor="catering-nama">
            <Input
              id="catering-nama"
              placeholder={copy.nama}
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              autoComplete="name"
              className={CATERING_FIELD}
            />
          </CateringField>
          <CateringField label={copy.labelTelepon} htmlFor="catering-telepon">
            <Input
              id="catering-telepon"
              placeholder={copy.telepon}
              value={form.telepon}
              onChange={(e) => setForm({ ...form, telepon: e.target.value })}
              autoComplete="tel"
              className={CATERING_FIELD}
            />
          </CateringField>
          <CateringField label={copy.labelEmail} htmlFor="catering-email">
            <Input
              id="catering-email"
              type="email"
              placeholder={copy.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              className={CATERING_FIELD}
            />
          </CateringField>
          <CateringField label={copy.labelService}>
            <Select value={form.tipe} onValueChange={(v) => setForm({ ...form, tipe: v })}>
              <SelectTrigger className={CATERING_SELECT} aria-label={copy.labelService}>
                <SelectValue placeholder={copy.service} />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={6} className={CATERING_SELECT_MENU}>
                {CATERING_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value} className={CATERING_SELECT_ITEM}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CateringField>
          <CateringField label={copy.labelPax} htmlFor="catering-pax">
            <Input
              id="catering-pax"
              type="number"
              min={10}
              placeholder={copy.pax}
              value={form.pax}
              onChange={(e) => setForm({ ...form, pax: e.target.value })}
              className={CATERING_FIELD}
            />
          </CateringField>
        </div>

        <PrivacyConsentField
          checked={privacyAccepted}
          onCheckedChange={onPrivacyChange}
          lang={lang}
          id="catering-privacy-consent"
          className="mt-4"
        />

        <div className="mt-5 flex flex-col items-stretch gap-2.5 border-t border-[#3F0000]/8 pt-4 sm:mt-6 sm:gap-3 sm:pt-5 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between lg:mt-6 lg:pt-6">
          <p className="font-[var(--font-form)] text-xs sm:text-sm italic text-[#6b4f4f]/85 min-[480px]:max-w-[240px]">
            {copy.hint}
          </p>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "h-11 w-full shrink-0 rounded-lg border border-[#3F0000]/20 px-6 font-heroCta text-[15px] font-bold italic tracking-[0.03em] text-white sm:h-[52px] sm:px-8 sm:text-base xl:h-[60px] xl:text-lg",
              "bg-gradient-to-r from-[#3F0000] to-[#5a0000] shadow-[0_14px_32px_-12px_rgba(63,0,0,0.55)]",
              "transition-all hover:from-[#520000] hover:to-[#6a0000] hover:shadow-[0_18px_36px_-10px_rgba(63,0,0,0.6)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F0000]/30 focus-visible:ring-offset-2",
              "disabled:opacity-70 disabled:shadow-none",
              "min-[480px]:w-[300px]",
            )}
          >
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : copy.submit}
          </button>
        </div>
      </div>
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
    eyebrow: lang === "ID" ? "Konsultasi Katering" : "Catering Inquiry",
    title: lang === "ID" ? "Rencanakan Katering Anda Bersama Kami" : "Plan Your Catering With Us",
    subtitle:
      lang === "ID"
        ? "Ceritakan kebutuhan acara Anda — tim kami siap menyesuaikan menu dan jumlah tamu."
        : "Tell us about your event — our team will tailor the menu and guest count for you.",
    labelNama: lang === "ID" ? "Nama Lengkap" : "Full Name",
    labelTelepon: lang === "ID" ? "WhatsApp" : "WhatsApp",
    labelEmail: lang === "ID" ? "Email" : "Email",
    labelService: lang === "ID" ? "Jenis Layanan" : "Service Type",
    labelPax: lang === "ID" ? "Perkiraan Tamu" : "Estimated Guests",
    nama: lang === "ID" ? "Contoh: Budi Santoso" : "e.g. John Smith",
    telepon: lang === "ID" ? "08xxxxxxxxxx" : "08xxxxxxxxxx",
    email: lang === "ID" ? "email@contoh.com" : "you@example.com",
    service: lang === "ID" ? "Pilih layanan" : "Select service",
    pax: lang === "ID" ? "Min. 10 orang" : "Min. 10 guests",
    hint:
      lang === "ID"
        ? "Lanjutkan ke WhatsApp untuk konfirmasi cepat."
        : "Continue on WhatsApp for a quick follow-up.",
    submit: lang === "ID" ? "Konsultasi via WhatsApp" : "Consult via WhatsApp",
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

  return (
    <section
      id="catering-inquiry-section"
      className="relative bg-[#FFFCF8] scroll-mt-20 sm:scroll-mt-24 overflow-hidden"
    >
      {/* Mobile / tablet: form atas, foto bawah */}
      <div className="xl:hidden">
        <div className="px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
          <CateringForm
            form={form}
            setForm={setForm}
            copy={copy}
            loading={loading}
            onSubmit={handleSubmit}
            privacyAccepted={privacyAccepted}
            onPrivacyChange={setPrivacyAccepted}
            lang={lang}
          />
        </div>
        <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
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

      {/* Desktop: pecah kiri (form) | kanan (foto) — Figma Frame 7 */}
      <div className="hidden xl:grid xl:grid-cols-[minmax(520px,1fr)_minmax(0,800px)] min-h-[min(900px,90svh)] max-w-[1920px] mx-auto">
        <div className="flex items-center justify-end py-16 pl-8 xl:pl-[217px] pr-8 xl:pr-12">
          <CateringForm
            form={form}
            setForm={setForm}
            copy={copy}
            loading={loading}
            onSubmit={handleSubmit}
            privacyAccepted={privacyAccepted}
            onPrivacyChange={setPrivacyAccepted}
            lang={lang}
            className="w-full max-w-[651px]"
          />
        </div>

        <div className="relative min-h-[560px] overflow-hidden bg-neutral-100">
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
    </section>
  );
}
