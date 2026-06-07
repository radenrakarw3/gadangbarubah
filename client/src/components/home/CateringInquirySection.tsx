import { memo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CATERING_TYPES,
  COMPANY,
  HOME_CATERING_SERVICES,
} from "@/lib/siteContent";
import mealboxImg from "@assets/Nasi Box_1758628102653.jpg";
import buffetImg from "@assets/DSC03388_1758567885565.jpg";
import snackboxImg from "@assets/DSC03165_1758567860370.jpg";
import rentalRoomImg from "@assets/DSC03147_1758567860387.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";
import deliveryImg from "@assets/DSC07153_1758564588952.jpg";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import PrivacyConsentField from "@/components/PrivacyConsentField";

const SERVICE_IMAGES: Record<(typeof HOME_CATERING_SERVICES)[number]["id"], string> = {
  mealbox: mealboxImg,
  buffet: buffetImg,
  snackbox: snackboxImg,
  "rental-room": rentalRoomImg,
  stall: stallImg,
  "home-delivery": deliveryImg,
};

/** Field form — Figma Frame 7 */
const FIGMA_CATERING_FIELD =
  "h-[60px] min-w-0 w-full rounded-lg border-0 bg-[rgba(82,82,82,0.39)] font-[var(--font-form)] text-lg font-normal italic tracking-[0.03em] text-[#D2D2D2] shadow-none " +
  "text-center placeholder:text-[#D2D2D2] placeholder:italic placeholder:text-center placeholder:text-lg " +
  "focus-visible:ring-1 focus-visible:ring-[#590000]/40 focus-visible:ring-offset-0";

const FIGMA_CATERING_SELECT = cn(
  FIGMA_CATERING_FIELD,
  "justify-center text-center [&>span]:w-full [&>span]:text-center [&>span]:text-[#D2D2D2] [&>span]:line-clamp-1 [&_svg]:text-[#D2D2D2]/70",
);

const FIGMA_SELECT_MENU =
  "z-[120] max-h-60 overflow-y-auto rounded-lg border border-black/10 bg-[#3a3a3a] text-white shadow-xl";

const FIGMA_SELECT_ITEM =
  "rounded-md focus:bg-white/15 focus:text-white data-[highlighted]:bg-white/15";

type Service = (typeof HOME_CATERING_SERVICES)[number];

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
    <form onSubmit={onSubmit} className={cn("w-full max-w-[651px]", className)}>
      <header className="mb-8 text-center xl:mb-10">
        <h2 className="font-[var(--font-inquiry)] text-[clamp(1.75rem,2.2vw,2.625rem)] font-medium leading-[1.2] tracking-[0.01em] text-black">
          {copy.title}
        </h2>
        <p className="mx-auto mt-3 max-w-[433px] font-[var(--font-inquiry)] text-base font-medium leading-8 tracking-[0.01em] text-black">
          {copy.subtitle}
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
            "h-[60px] min-w-0 w-full rounded-lg border-0 bg-[rgba(89,0,0,0.9)] px-4 font-heroCta text-lg font-bold italic tracking-[0.03em] text-[rgba(210,210,210,0.95)] shadow-none",
            "transition-colors hover:bg-[rgba(89,0,0,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#590000]/50",
            "disabled:opacity-70",
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
        className="mx-auto mt-5 max-w-md justify-center"
      />
    </form>
  );
}

function ServiceTile({
  service,
  lang,
  onSelect,
  className,
}: {
  service: Service;
  lang: "ID" | "EN";
  onSelect: (service: Service) => void;
  className?: string;
}) {
  const name = lang === "ID" ? service.nameID : service.nameEN;
  const image = SERVICE_IMAGES[service.id];

  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={cn(
        "group relative min-h-[140px] overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/60 sm:min-h-[180px]",
        className,
      )}
      aria-label={name}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5 transition-opacity duration-300 group-hover:from-black/65"
        aria-hidden
      />
      <span className="absolute bottom-3 left-3 right-3 font-heroCta text-base leading-snug tracking-[0.01em] text-white drop-shadow-sm sm:bottom-4 sm:left-4 sm:text-xl">
        {name}
      </span>
    </button>
  );
}

function ServiceCollage({
  lang,
  onSelect,
  className,
}: {
  lang: "ID" | "EN";
  onSelect: (service: Service) => void;
  className?: string;
}) {
  const topRow = HOME_CATERING_SERVICES.filter((s) => s.row === "top");
  const bottomRow = HOME_CATERING_SERVICES.filter((s) => s.row === "bottom");

  return (
    <div className={cn("grid min-h-0 w-full grid-cols-3 grid-rows-[11fr_10fr]", className)}>
      {topRow.map((service) => (
        <ServiceTile
          key={service.id}
          service={service}
          lang={lang}
          onSelect={onSelect}
          className="min-h-0"
        />
      ))}
      {bottomRow.map((service) => (
        <ServiceTile
          key={service.id}
          service={service}
          lang={lang}
          onSelect={onSelect}
          className="min-h-0"
        />
      ))}
    </div>
  );
}

function ServiceDialog({
  service,
  lang,
  open,
  onOpenChange,
  onChooseService,
}: {
  service: Service | null;
  lang: "ID" | "EN";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseService: (cateringType: string) => void;
}) {
  if (!service) return null;

  const name = lang === "ID" ? service.nameID : service.nameEN;
  const description = lang === "ID" ? service.descriptionID : service.descriptionEN;
  const chooseLabel =
    lang === "ID" ? "Pilih layanan ini" : "Choose this service";
  const image = SERVICE_IMAGES[service.id];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
            aria-hidden
          />
        </div>
        <div className="space-y-4 p-6">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="font-heroCta text-xl text-[#3D0C0C]">
              {name}
            </DialogTitle>
            <DialogDescription className="font-[var(--font-inquiry)] text-base leading-relaxed text-black/80">
              {description}
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => {
              onChooseService(service.cateringType);
              onOpenChange(false);
            }}
            className="h-11 w-full rounded-lg bg-[rgba(89,0,0,0.9)] font-heroCta text-sm font-bold italic tracking-[0.03em] text-[rgba(210,210,210,0.95)] transition-colors hover:bg-[rgba(89,0,0,1)]"
          >
            {chooseLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CateringInquirySection() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const [loading, setLoading] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
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
    collageTitle: lang === "ID" ? "Layanan Kami" : "Our Services",
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
        description:
          lang === "ID" ? "Isi nama dan nomor telepon." : "Please fill in your name and phone number.",
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

  const handleChooseService = (cateringType: string) => {
    setForm((prev) => ({ ...prev, tipe: cateringType }));
    document.getElementById("catering-inquiry-section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
      className="relative scroll-mt-20 overflow-hidden bg-white sm:scroll-mt-24"
    >
      {/* Mobile / tablet */}
      <div className="xl:hidden">
        <div className="bg-[#D9D9D9] px-4 py-10 sm:px-8 sm:py-14">
          <CateringForm {...formProps} className="mx-auto" />
        </div>
        <div className="bg-white px-4 py-8 sm:px-8">
          <h3 className="mb-4 text-center font-heroCta text-lg tracking-[0.01em] text-[#3D0C0C]">
            {copy.collageTitle}
          </h3>
          <ServiceCollage
            lang={lang}
            onSelect={setActiveService}
            className="overflow-hidden rounded-lg"
          />
        </div>
      </div>

      {/* Desktop — grid 4 kolom selaras dengan outlet section (col 1–2 form, col 3–4 kolase) */}
      <div className="mx-auto hidden w-full max-w-[1920px] xl:grid xl:min-h-[900px] xl:grid-cols-4 xl:items-stretch">
        <div className="col-span-2 flex items-center justify-center bg-[#D9D9D9] px-[clamp(2rem,5vw,5rem)] py-12">
          <CateringForm {...formProps} />
        </div>

        <div className="col-span-2 min-h-0">
          <ServiceCollage lang={lang} onSelect={setActiveService} className="min-h-[900px]" />
        </div>
      </div>

      <ServiceDialog
        service={activeService}
        lang={lang}
        open={activeService !== null}
        onOpenChange={(open) => !open && setActiveService(null)}
        onChooseService={handleChooseService}
      />
    </section>
  );
}

export default memo(CateringInquirySection);
