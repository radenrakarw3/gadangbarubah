import { memo, useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReservationHoneypot, RESERVATION_HONEYPOT_FIELD } from "@/components/ReservationHoneypot";
import PrivacyConsentField from "@/components/PrivacyConsentField";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, parseApiError } from "@/lib/queryClient";
import { CATERING_TYPES, COMPANY } from "@/lib/siteContent";
import { KEMITRAAN_INQUIRY } from "@/lib/kemitraanContent";
import { takePendingKemitraanService } from "@/lib/kemitraanSelection";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import sideImage from "@assets/catering-buffet_1781246285353.jpg";

const FIELD =
  "h-[52px] min-w-0 w-full rounded-lg border border-black/10 bg-white font-[var(--font-form)] text-base text-[#2C2C2C] shadow-none " +
  "placeholder:text-black/40 focus-visible:ring-1 focus-visible:ring-[#590000]/30 focus-visible:ring-offset-0";

const SELECT = cn(FIELD, "justify-between");

function KemitraanInquirySection() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const copy = KEMITRAAN_INQUIRY[lang];
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    tanggalEvent: "",
    eventDetail: "",
    lokasiEvent: "",
    tipe: CATERING_TYPES[0].value as string,
    pax: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const labels = {
    nama: lang === "ID" ? "Nama PIC" : "PIC Name",
    telepon: lang === "ID" ? "No. Telepon" : "Phone Number",
    tanggalEvent: lang === "ID" ? "Tanggal Event" : "Event Date",
    eventDetail: lang === "ID" ? "Detail Acara" : "Event Details",
    lokasiEvent: lang === "ID" ? "Lokasi" : "Location",
    service: lang === "ID" ? "Jenis Layanan" : "Service Type",
    pax: lang === "ID" ? "Jumlah Pax" : "Guest Count",
    submit: lang === "ID" ? "Kirim Permintaan Kemitraan" : "Submit Partnership Request",
  };

  const handleChooseService = useCallback((cateringType: string) => {
    setForm((prev) => ({ ...prev, tipe: cateringType }));
  }, []);

  useEffect(() => {
    const pending = takePendingKemitraanService();
    if (pending) handleChooseService(pending);
  }, [handleChooseService]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ cateringType: string }>).detail;
      if (detail?.cateringType) handleChooseService(detail.cateringType);
    };
    window.addEventListener("kemitraan-select-service", handler);
    return () => window.removeEventListener("kemitraan-select-service", handler);
  }, [handleChooseService]);

  const waHref = () => {
    const text = encodeURIComponent(
      lang === "ID"
        ? "Halo Gadang Barubah, saya ingin diskusi kemitraan catering/event."
        : "Hello Gadang Barubah, I'd like to discuss event/catering partnership.",
    );
    return `https://wa.me/${COMPANY.cateringWhatsapp}?text=${text}`;
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

    if (
      !form.nama.trim() ||
      form.telepon.length < 10 ||
      !form.tanggalEvent.trim() ||
      !form.eventDetail.trim() ||
      !form.lokasiEvent.trim() ||
      !form.pax.trim()
    ) {
      toast({
        title: lang === "ID" ? "Data belum lengkap" : "Incomplete data",
        description: lang === "ID" ? "Lengkapi semua field." : "Please complete all fields.",
        variant: "destructive",
      });
      return;
    }

    const formEl = e.currentTarget as HTMLFormElement;
    const honeypot = String(new FormData(formEl).get(RESERVATION_HONEYPOT_FIELD) ?? "").trim();
    if (honeypot) return;

    setLoading(true);
    try {
      const tipeLabel = CATERING_TYPES.find((t) => t.value === form.tipe)?.label ?? form.tipe;
      const res = await apiRequest("POST", "/api/catering-inquiries", {
        nama: form.nama.trim(),
        telepon: form.telepon,
        tanggalEvent: form.tanggalEvent.trim(),
        eventDetail: form.eventDetail.trim(),
        lokasiEvent: form.lokasiEvent.trim(),
        tipe: form.tipe,
        pax: parseInt(form.pax, 10) || 1,
        [RESERVATION_HONEYPOT_FIELD]: "",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      const message = encodeURIComponent(
        lang === "ID"
          ? `Halo Gadang Barubah, saya ingin konsultasi kemitraan:\n\nNama PIC: ${form.nama}\nNo.hp: ${form.telepon}\nTanggal: ${form.tanggalEvent}\nDetail: ${form.eventDetail}\nLokasi: ${form.lokasiEvent}\nLayanan: ${tipeLabel}\nPax: ${form.pax}\nRef: ${result.data?.shortId ?? ""}`
          : `Hello Gadang Barubah, partnership inquiry:\n\nPIC: ${form.nama}\nPhone: ${form.telepon}\nDate: ${form.tanggalEvent}\nDetails: ${form.eventDetail}\nLocation: ${form.lokasiEvent}\nService: ${tipeLabel}\nPax: ${form.pax}\nRef: ${result.data?.shortId ?? ""}`,
      );
      window.open(`https://wa.me/${COMPANY.cateringWhatsapp}?text=${message}`, "_blank");
      toast({
        title: lang === "ID" ? "Permintaan terkirim" : "Request sent",
        description:
          lang === "ID" ? "Tim kami akan segera menghubungi Anda." : "Our team will contact you shortly.",
      });
    } catch (err) {
      toast({
        title: lang === "ID" ? "Gagal mengirim" : "Submission failed",
        description: parseApiError(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="kemitraan-inquiry-section"
      className="scroll-mt-24 bg-[#FFFCF8] py-14 sm:scroll-mt-28 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:items-start">
          <div className="rounded-xl border border-black/8 bg-white p-6 shadow-sm sm:p-8">
            <header className="mb-8">
              <h2 className="font-inquiry text-figma-inquiry-title text-[#3D0C0C]">{copy.title}</h2>
              <p className="mt-2 font-heroCta text-figma-body text-black/65">{copy.subtitle}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <ReservationHoneypot />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.nama}</label>
                  <Input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    autoComplete="name"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.telepon}</label>
                  <Input
                    value={form.telepon}
                    onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                    autoComplete="tel"
                    inputMode="tel"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.tanggalEvent}</label>
                  <Input
                    value={form.tanggalEvent}
                    onChange={(e) => setForm({ ...form, tanggalEvent: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.pax}</label>
                  <Input
                    type="number"
                    min={1}
                    value={form.pax}
                    onChange={(e) => setForm({ ...form, pax: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.eventDetail}</label>
                  <Input
                    value={form.eventDetail}
                    onChange={(e) => setForm({ ...form, eventDetail: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.lokasiEvent}</label>
                  <Input
                    value={form.lokasiEvent}
                    onChange={(e) => setForm({ ...form, lokasiEvent: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-heroCta text-xs text-black/55">{labels.service}</label>
                  <Select value={form.tipe} onValueChange={(v) => setForm({ ...form, tipe: v })}>
                    <SelectTrigger id="kemitraan-service-select" className={SELECT} aria-label={labels.service}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      {CATERING_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-[52px] w-full items-center justify-center rounded-lg bg-[#3F0000] font-heroCta text-base font-medium italic tracking-[0.03em] text-white transition-colors hover:bg-[#520000] disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : labels.submit}
              </button>

              <PrivacyConsentField
                checked={privacyAccepted}
                onCheckedChange={setPrivacyAccepted}
                lang={lang}
                id="kemitraan-privacy"
                className="mt-4"
              />
            </form>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={sideImage}
                alt=""
                className="aspect-[4/3] w-full object-cover lg:aspect-[3/4] lg:min-h-[320px]"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#300505]/70 to-transparent" aria-hidden />
            </div>
            <div className="rounded-xl border border-[#3F0000]/10 bg-[#f5ebe6] p-6">
              <h3 className="font-heroCta text-lg text-[#3D0C0C]">{copy.sideTitle}</h3>
              <p className="mt-2 font-heroCta text-sm leading-relaxed text-black/70">{copy.sideBody}</p>
              <a
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 font-heroCta text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {copy.waCta}
              </a>
              <p className="mt-4 font-heroCta text-sm text-black/55">{COMPANY.cateringPhoneDisplay}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default memo(KemitraanInquirySection);
