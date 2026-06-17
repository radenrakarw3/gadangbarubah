import { memo, useState, useMemo, useRef, useEffect, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationHoneypot, RESERVATION_HONEYPOT_FIELD } from "@/components/ReservationHoneypot";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, parseApiError } from "@/lib/queryClient";
import { OUTLETS, todayISO } from "@/lib/siteContent";
import {
  availableTimeSlotsForDate,
  isValidWhatsApp,
  normalizeWhatsAppInput,
  validateReservationDateTime,
} from "@shared/reservation-utils";
import { cn } from "@/lib/utils";
import { useSiteLanguage } from "@/lib/language";
import PrivacyConsentField from "@/components/PrivacyConsentField";

/** Field glass — compact sesuai revisi Figma */
const FIGMA_CONTROL =
  "h-8 sm:h-8 xl:h-9 w-full min-w-0 rounded-lg border-0 bg-[rgba(82,82,82,0.39)] font-[var(--font-form)] text-xs font-normal italic tracking-[0.03em] text-[#D2D2D2] shadow-none " +
  "placeholder:text-[#D2D2D2]/90 placeholder:italic placeholder:text-xs sm:placeholder:text-[13px] focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-0 [color-scheme:dark] " +
  "px-2.5 sm:px-3 xl:px-2.5";

const FIGMA_SELECT_TRIGGER = cn(
  FIGMA_CONTROL,
  "focus:ring-1 focus:ring-white/30 focus:ring-offset-0",
  "[&>span]:text-[#D2D2D2] [&>span]:line-clamp-1 [&>span]:text-xs sm:[&>span]:text-[13px]",
  "[&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:text-[#D2D2D2]/70",
);

const FIGMA_DATE_SHELL =
  "relative h-8 sm:h-8 xl:h-9 w-full min-w-0 overflow-hidden rounded-lg border-0 bg-[rgba(82,82,82,0.39)] transition-[box-shadow,background-color] duration-200";

const FIGMA_DATE_SHELL_TODAY =
  "bg-[rgba(82,82,82,0.48)] ring-1 ring-white/20";

const FIGMA_DATE_INPUT =
  "h-full w-full min-w-0 rounded-lg border-0 bg-transparent px-2.5 pr-[4.35rem] sm:px-3 sm:pr-[5.35rem] font-[var(--font-form)] text-xs sm:text-[13px] font-normal italic tracking-[0.03em] text-[#D2D2D2] shadow-none uppercase " +
  "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none [color-scheme:dark] xl:px-2.5 xl:pr-[4.85rem] " +
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-80";

const FIGMA_DATE_INPUT_TODAY =
  "text-white [&::-webkit-calendar-picker-indicator]:opacity-90";

const FIGMA_DATE_TODAY_BTN_BASE =
  "absolute right-1 top-1/2 z-10 h-6 sm:h-7 xl:h-8 -translate-y-1/2 rounded-md border-0 px-1.5 sm:px-2 font-[var(--font-form)] text-[10px] sm:text-[11px] font-normal italic tracking-[0.02em] transition-all duration-200 xl:right-1 xl:px-1.5 " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:ring-offset-0";

const FIGMA_DATE_TODAY_BTN_IDLE =
  "bg-black/15 text-[#D2D2D2]/45 hover:bg-black/25 hover:text-[#D2D2D2]/75";

const FIGMA_DATE_TODAY_BTN_ACTIVE =
  "bg-[rgba(89,0,0,0.82)] text-[rgba(255,255,255,0.95)] shadow-none hover:bg-[rgba(89,0,0,0.92)]";

const SELECT_CONTENT_CLASS =
  "z-[200] max-h-60 overflow-y-auto border-white/20 bg-[#3a3a3a] text-[#D2D2D2] rounded-lg shadow-2xl " +
  "data-[state=open]:animate-none data-[state=closed]:animate-none " +
  "[&_[data-radix-select-viewport]]:!h-auto [&_[data-radix-select-viewport]]:max-h-52";

const SELECT_ITEM_CLASS =
  "text-[#D2D2D2] rounded-md focus:bg-white/15 focus:text-white data-[highlighted]:bg-white/15";

const OUTLET_OPTIONS = OUTLETS.map((o) => ({ value: o.id, label: o.label }));
const DEFAULT_OUTLET_ID =
  OUTLETS.find((o) => o.id === "bintaro")?.id ?? OUTLETS[0].id;
const ReservationSelect = memo(function ReservationSelect({
  value,
  onValueChange,
  options,
  placeholder,
  "aria-label": ariaLabel,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(FIGMA_SELECT_TRIGGER, className)} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={6} className={SELECT_CONTENT_CLASS}>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className={SELECT_ITEM_CLASS}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

const ReservationDateField = memo(function ReservationDateField({
  value,
  min,
  onChange,
  onToday,
  isTodaySelected,
  todayLabel,
  ariaLabel,
  lang,
}: {
  value: string;
  min: string;
  onChange: (v: string) => void;
  onToday: () => void;
  isTodaySelected: boolean;
  todayLabel: string;
  ariaLabel: string;
  lang: "ID" | "EN";
}) {
  return (
    <div
      className={cn(FIGMA_DATE_SHELL, isTodaySelected && FIGMA_DATE_SHELL_TODAY)}
    >
      <Input
        type="date"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(FIGMA_DATE_INPUT, isTodaySelected && FIGMA_DATE_INPUT_TODAY)}
        aria-label={ariaLabel}
        lang={lang === "ID" ? "id" : "en"}
      />
      <span
        className={cn(
          "pointer-events-none absolute inset-y-1.5 right-[3.85rem] w-px transition-colors duration-200 sm:right-[4.85rem] lg:right-[4.55rem]",
          isTodaySelected ? "bg-white/25" : "bg-white/10",
        )}
        aria-hidden
      />
      <button
        type="button"
        onClick={onToday}
        className={cn(
          FIGMA_DATE_TODAY_BTN_BASE,
          isTodaySelected ? FIGMA_DATE_TODAY_BTN_ACTIVE : FIGMA_DATE_TODAY_BTN_IDLE,
        )}
        aria-pressed={isTodaySelected}
      >
        {todayLabel}
      </button>
    </div>
  );
});

function QuickReservationBarInner() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tanggal, setTanggal] = useState(() => todayISO());
  const [waktu, setWaktu] = useState("18:00");
  const [outlet, setOutlet] = useState<string>(DEFAULT_OUTLET_ID);
  const [pax, setPax] = useState("2");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const formKey = useRef(0);

  const placeholders = {
    nama: lang === "ID" ? "(Nama Anda)" : "(Your Name)",
    telepon: lang === "ID" ? "(No. Handphone)" : "(Phone Number)",
    email: lang === "ID" ? "(Email)" : "(Email)",
    outlet: lang === "ID" ? "Pilih Outlet (v)" : "Choose Outlet (v)",
    pax: lang === "ID" ? "(Tamu)" : "(Pax)",
    tanggal: lang === "ID" ? "(Tanggal)" : "(Date)",
    waktu: lang === "ID" ? "(Jam)" : "(Time)",
    today: lang === "ID" ? "Hari Ini" : "Today",
    reserve: lang === "ID" ? "Reservasi Sekarang!" : "Reserve Now!",
    reserveShort: lang === "ID" ? "Reservasi" : "Reserve",
  };

  const isTodaySelected = tanggal === todayISO();
  const minDate = todayISO();

  const timeOptions = useMemo(
    () =>
      availableTimeSlotsForDate(tanggal).map((s) => ({
        value: s,
        label: `${s} WIB`,
      })),
    [tanggal],
  );

  useEffect(() => {
    const available = availableTimeSlotsForDate(tanggal);
    if (available.length === 0) return;
    if (!available.includes(waktu as (typeof available)[number])) {
      setWaktu(available[0]);
    }
  }, [tanggal, waktu]);

  const paxOptions = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const n = String(i + 1);
        const unit = lang === "ID" ? "Tamu" : "Pax";
        return { value: n, label: `${n} ${unit}` };
      }),
    [lang],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const resetForm = () => {
    formKey.current += 1;
    setTanggal(todayISO());
    setWaktu("18:00");
    setOutlet(DEFAULT_OUTLET_ID);
    setPax("2");
    setPrivacyAccepted(false);
    setMobileOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nama = String(fd.get("nama") ?? "").trim();
    const telepon = normalizeWhatsAppInput(String(fd.get("telepon") ?? ""));
    const email = String(fd.get("email") ?? "").trim();
    const honeypot = String(fd.get(RESERVATION_HONEYPOT_FIELD) ?? "").trim();
    if (honeypot) return;

    if (!nama) {
      toast({
        title: lang === "ID" ? "Data belum lengkap" : "Incomplete data",
        description: lang === "ID" ? "Isi nama lengkap Anda." : "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidWhatsApp(telepon)) {
      toast({
        title: lang === "ID" ? "Nomor tidak valid" : "Invalid phone number",
        description:
          lang === "ID"
            ? "Gunakan nomor WhatsApp aktif format 08xxxxxxxxxx."
            : "Use an active WhatsApp number in 08xxxxxxxxxx format.",
        variant: "destructive",
      });
      return;
    }

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

    if (!tanggal || !waktu) {
      toast({
        title: lang === "ID" ? "Tanggal & jam wajib" : "Date & time required",
        description:
          lang === "ID"
            ? "Pilih tanggal dan waktu reservasi."
            : "Please select reservation date and time.",
        variant: "destructive",
      });
      return;
    }

    const dateTimeError = validateReservationDateTime(tanggal, waktu);
    if (dateTimeError) {
      toast({
        title: lang === "ID" ? "Tanggal atau jam tidak valid" : "Invalid date or time",
        description: dateTimeError,
        variant: "destructive",
      });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: lang === "ID" ? "Email tidak valid" : "Invalid email",
        description:
          lang === "ID"
            ? "Kosongkan field email atau gunakan format email yang benar."
            : "Leave email empty or use a valid email format.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        namaLengkap: nama,
        noWhatsApp: telepon,
        email: email || undefined,
        outlet,
        tanggalReservasi: tanggal,
        waktuReservasi: waktu,
        jumlahTamu: parseInt(pax, 10) || 2,
        tipeMeja: "reguler",
        catatan: "Quick reserve dari homepage",
        [RESERVATION_HONEYPOT_FIELD]: "",
      };
      const res = await apiRequest("POST", "/api/reservations", payload);
      const result = await res.json();
      if (result.success) {
        toast({
          title: lang === "ID" ? "Reservasi terkirim" : "Reservation submitted",
          description:
            lang === "ID"
              ? "Tim kami akan menghubungi Anda via WhatsApp."
              : "Our team will contact you via WhatsApp.",
        });
        resetForm();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast({
        title: lang === "ID" ? "Gagal mengirim reservasi" : "Reservation failed",
        description: parseApiError(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[min(100%,1460px)] mx-auto w-full min-w-0">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-black/55 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label={lang === "ID" ? "Tutup form reservasi" : "Close reservation form"}
        />
      )}

      {!mobileOpen && (
        <button
          type="button"
          className="lg:hidden flex h-10 w-full items-center justify-between gap-2 rounded-lg bg-[rgba(82,82,82,0.5)] px-3 text-left shadow-[0_4px_20px_-6px_rgba(0,0,0,0.45)] active:bg-[rgba(82,82,82,0.65)] transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-expanded={false}
          aria-controls="quick-reservation-form"
        >
          <span className="font-[Poppins] text-sm font-medium italic tracking-[0.03em] text-[#D2D2D2]">
            {placeholders.reserveShort}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[#D2D2D2]/80" />
        </button>
      )}

      <form
        id="quick-reservation-form"
        key={formKey.current}
        onSubmit={handleSubmit}
        className={cn(
          !mobileOpen && "hidden lg:block",
          mobileOpen &&
            "fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(88dvh,640px)] flex-col overflow-hidden rounded-t-2xl border-t border-white/15 bg-[#1a0808]/98 shadow-[0_-12px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:static lg:max-h-none lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
          <p className="font-[Poppins] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D2D2D2]/75">
            {lang === "ID" ? "Reservasi meja" : "Table reservation"}
          </p>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#D2D2D2]/70 hover:bg-white/10 hover:text-[#D2D2D2]"
            onClick={() => setMobileOpen(false)}
            aria-label={lang === "ID" ? "Tutup form reservasi" : "Close reservation form"}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-5 sm:p-3.5 lg:overflow-visible lg:gap-0 lg:p-0 lg:pb-0">
          <ReservationHoneypot />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-4 lg:items-center lg:gap-2 xl:grid-cols-7 xl:gap-2.5">
            <Input
              name="nama"
              placeholder={placeholders.nama}
              defaultValue=""
              autoComplete="name"
              className={FIGMA_CONTROL}
            />
            <Input
              name="telepon"
              placeholder={placeholders.telepon}
              defaultValue=""
              autoComplete="tel"
              className={FIGMA_CONTROL}
            />
            <Input
              name="email"
              type="email"
              placeholder={placeholders.email}
              defaultValue=""
              autoComplete="email"
              className={FIGMA_CONTROL}
            />
            <ReservationSelect
              value={outlet}
              onValueChange={setOutlet}
              options={OUTLET_OPTIONS}
              placeholder={placeholders.outlet}
              aria-label={lang === "ID" ? "Outlet" : "Outlet"}
              className="min-w-0"
            />
            <ReservationSelect
              value={pax}
              onValueChange={setPax}
              options={paxOptions}
              placeholder={placeholders.pax}
              aria-label={lang === "ID" ? "Jumlah tamu" : "Number of guests"}
              className="min-w-0"
            />
            <ReservationDateField
              value={tanggal}
              min={minDate}
              onChange={setTanggal}
              onToday={() => setTanggal(todayISO())}
              isTodaySelected={isTodaySelected}
              todayLabel={placeholders.today}
              ariaLabel={placeholders.tanggal}
              lang={lang}
            />
            <ReservationSelect
              value={waktu}
              onValueChange={setWaktu}
              options={timeOptions}
              placeholder={placeholders.waktu}
              aria-label={lang === "ID" ? "Jam reservasi" : "Reservation time"}
              className="min-w-0"
            />
          </div>

          <div className="mx-auto flex w-full max-w-[min(100%,920px)] flex-col items-center gap-5 pt-3 sm:pt-4 lg:gap-5 lg:pt-4 xl:pt-5">
            <PrivacyConsentField
              checked={privacyAccepted}
              onCheckedChange={setPrivacyAccepted}
              lang={lang}
              variant="dark"
              compact
              id="hero-privacy-consent"
              className="w-auto max-w-full justify-center"
            />
            <Button
              type="submit"
              disabled={loading || timeOptions.length === 0}
              className="h-8 w-full max-w-[280px] rounded-lg border-0 bg-[rgba(89,0,0,0.9)] px-6 font-heroCta text-xs font-bold italic tracking-[0.03em] text-[rgba(210,210,210,0.95)] shadow-none hover:bg-[rgba(89,0,0,1)] sm:h-9 sm:text-[13px] xl:h-9 xl:w-auto xl:min-w-[200px] xl:max-w-[280px]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : placeholders.reserve}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

const QuickReservationBar = memo(QuickReservationBarInner);
export default QuickReservationBar;
