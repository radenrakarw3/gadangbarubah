import { memo, useState, useMemo, useRef, type FormEvent } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, parseApiError } from "@/lib/queryClient";
import { OUTLETS, RESERVATION_TIME_SLOTS, todayISO } from "@/lib/siteContent";
import { cn } from "@/lib/utils";
import { useSiteLanguage } from "@/lib/language";

const CONTROL_CLASS =
  "h-11 sm:h-9 w-full rounded-sm border border-white/15 bg-white/[0.07] text-white text-base sm:text-sm placeholder:text-white/35 focus-visible:ring-1 focus-visible:ring-gold/50 focus-visible:border-gold/40 [color-scheme:dark]";

const SELECT_TRIGGER_CLASS = cn(
  CONTROL_CLASS,
  "px-3 focus:ring-1 focus:ring-gold/50 focus:ring-offset-0",
  "[&>span]:text-white [&>span]:line-clamp-1",
  "[&_svg]:text-white/60",
);

const SELECT_CONTENT_CLASS =
  "z-[200] max-h-60 overflow-y-auto border-gold/30 bg-maroon-deep text-white rounded-sm shadow-2xl " +
  "data-[state=open]:animate-none data-[state=closed]:animate-none " +
  "[&_[data-radix-select-viewport]]:!h-auto [&_[data-radix-select-viewport]]:max-h-52";

const SELECT_ITEM_CLASS =
  "text-white rounded-none focus:bg-gold/20 focus:text-gold-light data-[highlighted]:bg-gold/20 data-[highlighted]:text-gold-light";

const OUTLET_OPTIONS = OUTLETS.map((o) => ({ value: o.id, label: o.label }));
const TIME_OPTIONS = RESERVATION_TIME_SLOTS.map((s) => ({
  value: s,
  label: `${s} WIB`,
}));
const PAX_OPTIONS = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1);
  return { value: n, label: `${n} tamu` };
});

const ReservationSelect = memo(function ReservationSelect({
  value,
  onValueChange,
  options,
  placeholder,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  "aria-label"?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={SELECT_TRIGGER_CLASS} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={6}
        className={SELECT_CONTENT_CLASS}
      >
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className={SELECT_ITEM_CLASS}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
const Field = memo(function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1 min-w-0", className)}>
      <label className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-medium block">
        {label}
      </label>
      {children}
    </div>
  );
});

function QuickReservationBarInner() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tanggal, setTanggal] = useState(todayISO);
  const [waktu, setWaktu] = useState("18:00");
  const [outlet, setOutlet] = useState(OUTLETS[0].id as string);
  const [pax, setPax] = useState("2");
  const formKey = useRef(0);
  const minDate = useMemo(() => todayISO(), []);
  const isToday = tanggal === minDate;

  const resetForm = () => {
    formKey.current += 1;
    setTanggal(todayISO());
    setWaktu("18:00");
    setOutlet(OUTLETS[0].id as string);
    setPax("2");
    setMobileOpen(false);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nama = String(fd.get("nama") ?? "").trim();
    const telepon = String(fd.get("telepon") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!nama || telepon.length < 10) {      toast({
        title: lang === "ID" ? "Data belum lengkap" : "Incomplete data",
        description:
          lang === "ID"
            ? "Isi nama dan nomor telepon minimal 10 digit."
            : "Please provide name and at least 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!tanggal || !waktu) {
      toast({
        title: "Tanggal & jam wajib",
        description: "Pilih tanggal dan waktu reservasi.",
        variant: "destructive",
      });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email tidak valid",
        description: "Kosongkan field email atau gunakan format email yang benar.",
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
        title: "Gagal mengirim reservasi",
        description: parseApiError(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto overflow-hidden rounded-sm border border-gold/25 bg-maroon-deep/95 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] [contain:layout_paint] isolate">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Mobile: bar ringkas — tap untuk buka form */}
      {!mobileOpen && (
        <button
          type="button"
          className="md:hidden w-full flex items-center justify-between gap-4 px-4 py-4 text-left active:bg-black/20 transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-expanded={false}
          aria-controls="quick-reservation-form"
        >
          <div className="min-w-0">
            <p className="font-display text-lg text-gold-light leading-tight tracking-wide">
              {lang === "ID" ? "Reservasi Meja" : "Table Reservation"}
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 mt-0.5">
              {lang === "ID" ? "Tap untuk booking online" : "Tap to book online"}
            </p>
          </div>
          <span className="shrink-0 flex items-center gap-1.5 rounded-sm bg-gold px-3 py-2 text-maroon-deep text-[10px] font-semibold uppercase tracking-[0.12em]">
            Buka
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
      )}

      <form
        id="quick-reservation-form"
        key={formKey.current}
        onSubmit={handleSubmit}
        className={cn(!mobileOpen && "hidden md:block")}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="shrink-0 border-b lg:border-b-0 lg:border-r border-gold/15 bg-black/20 px-4 py-3 sm:px-5 lg:py-0 lg:w-44 lg:flex lg:flex-col lg:justify-center lg:px-6 text-center lg:text-left relative">
            <button
              type="button"
              className="md:hidden absolute right-3 top-3 p-1.5 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup form reservasi"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <p className="font-display text-lg sm:text-xl lg:text-2xl text-gold-light leading-tight tracking-wide">
              {lang === "ID" ? "Reservasi" : "Reservation"}
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/45 mt-0.5">
              Meja · Gadang Barubah
            </p>
          </div>

        <div className="flex-1 p-3 sm:p-4 lg:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label={lang === "ID" ? "Nama" : "Name"}>
              <Input
                name="nama"
                placeholder={lang === "ID" ? "Nama lengkap" : "Full name"}
                defaultValue=""
                autoComplete="name"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field label={lang === "ID" ? "Telepon" : "Phone"}>
              <Input
                name="telepon"
                placeholder={lang === "ID" ? "08xxxxxxxxxx" : "08xxxxxxxxxx"}
                defaultValue=""
                autoComplete="tel"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field label={lang === "ID" ? "Email (opsional)" : "Email (optional)"}>
              <Input
                name="email"
                type="email"
                placeholder="email@example.com"
                defaultValue=""
                autoComplete="email"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field label={lang === "ID" ? "Outlet" : "Outlet"}>
              <ReservationSelect
                value={outlet}
                onValueChange={setOutlet}
                options={OUTLET_OPTIONS}
                placeholder={lang === "ID" ? "Pilih outlet" : "Select outlet"}
                aria-label="Outlet"
              />
            </Field>          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_6.5rem_1fr] gap-3 items-end">
            <Field label={lang === "ID" ? "Tanggal" : "Date"}>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="date"
                  min={minDate}
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className={cn(CONTROL_CLASS, "flex-1 min-w-0")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTanggal(minDate)}
                  className={cn(
                    "h-11 sm:h-9 shrink-0 rounded-sm text-[10px] uppercase tracking-wider border-white/20 w-full sm:w-auto",
                    isToday
                      ? "bg-gold/20 text-gold-light border-gold/40 hover:bg-gold/25"
                      : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {lang === "ID" ? "Hari Ini" : "Today"}
                </Button>
              </div>
            </Field>
            <Field label={lang === "ID" ? "Jam" : "Time"}>
              <ReservationSelect
                value={waktu}
                onValueChange={setWaktu}
                options={TIME_OPTIONS}
                placeholder={lang === "ID" ? "Pilih jam" : "Select time"}
                aria-label="Jam reservasi"
              />
            </Field>
            <Field label={lang === "ID" ? "Tamu" : "Guests"}>
              <ReservationSelect
                value={pax}
                onValueChange={setPax}
                options={PAX_OPTIONS}
                placeholder={lang === "ID" ? "Jumlah tamu" : "Guest count"}
                aria-label="Jumlah tamu"
              />
            </Field>            <Button
              type="submit"
              disabled={loading}
              className="h-12 sm:h-9 w-full rounded-sm bg-gold text-maroon-deep hover:bg-gold-light font-semibold uppercase tracking-[0.14em] text-sm sm:text-xs shadow-md mt-1 sm:mt-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : lang === "ID" ? "Reservasi" : "Reserve"}
            </Button>
          </div>
        </div>
        </div>
      </form>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </div>
  );
}

const QuickReservationBar = memo(QuickReservationBarInner);
export default QuickReservationBar;
