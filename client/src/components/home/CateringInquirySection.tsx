import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type ServiceOriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const EXPAND_MS = 1200;
const COLLAPSE_MS = 1000;
const CONTENT_MS = 650;
const EXIT_MS = 260;
const CONTENT_DELAY_MS = 820;
const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
const EASE_OUT = "cubic-bezier(0.4, 0, 0.2, 1)";

function tileToContainerTransform(
  origin: ServiceOriginRect,
  containerWidth: number,
  containerHeight: number,
): string {
  const sx = origin.width / containerWidth;
  const sy = origin.height / containerHeight;
  return `translate3d(${origin.left}px, ${origin.top}px, 0) scale(${sx}, ${sy})`;
}

function slideStyle(visible: boolean, delayMs: number, fromY = 12) {
  return {
    transition: visible
      ? `opacity ${CONTENT_MS}ms ${EASE} ${delayMs}ms, transform ${CONTENT_MS}ms ${EASE} ${delayMs}ms`
      : `opacity ${EXIT_MS}ms ${EASE_OUT}, transform ${EXIT_MS}ms ${EASE_OUT}`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${fromY}px, 0)`,
    pointerEvents: visible ? "auto" : "none",
  } satisfies CSSProperties;
}

function overlayFadeStyle(visible: boolean) {
  return {
    opacity: visible ? 1 : 0,
    transition: visible ? `opacity ${CONTENT_MS}ms ${EASE}` : `opacity ${EXIT_MS}ms ${EASE_OUT}`,
  } satisfies CSSProperties;
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

const MOBILE_COLLAGE_H = "h-[480px] sm:h-[560px]";

function ServiceTile({  service,
  lang,
  onSelect,
  className,
}: {
  service: Service;
  lang: "ID" | "EN";
  onSelect: (service: Service, event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const name = lang === "ID" ? service.nameID : service.nameEN;
  const image = SERVICE_IMAGES[service.id];

  return (
    <button
      type="button"
      onClick={(event) => onSelect(service, event)}
      className={cn(
        "group relative min-h-0 touch-manipulation overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/60 [-webkit-tap-highlight-color:transparent]",
        className,
      )}
      aria-label={name}
    >      <img
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
  layout = "mobile",
  className,
}: {
  lang: "ID" | "EN";
  onSelect: (service: Service, event: React.MouseEvent<HTMLButtonElement>) => void;
  layout?: "mobile" | "desktop";
  className?: string;
}) {
  const topRow = HOME_CATERING_SERVICES.filter((s) => s.row === "top");
  const bottomRow = HOME_CATERING_SERVICES.filter((s) => s.row === "bottom");
  const isDesktop = layout === "desktop";

  return (
    <div
      className={cn(
        "grid h-full w-full grid-cols-3 grid-rows-[11fr_10fr]",
        isDesktop ? "min-h-[900px]" : MOBILE_COLLAGE_H,
        className,
      )}
    >
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
function ServiceExpandedPanel({
  service,
  lang,
  layout,
  originRect,
  containerRef,
  onClose,
  onChooseService,
}: {
  service: Service;
  lang: "ID" | "EN";
  layout: "mobile" | "desktop";
  originRect: ServiceOriginRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onChooseService: (cateringType: string) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const containerSizeRef = useRef<{ width: number; height: number } | null>(null);
  const closingRef = useRef(false);
  const [expanded, setExpanded] = useState(!originRect);
  const [contentVisible, setContentVisible] = useState(!originRect);

  const name = lang === "ID" ? service.nameID : service.nameEN;
  const description = lang === "ID" ? service.descriptionID : service.descriptionEN;
  const chooseLabel = lang === "ID" ? "Pilih layanan ini" : "Choose this service";
  const closeLabel = lang === "ID" ? "Kembali ke layanan" : "Back to services";
  const image = SERVICE_IMAGES[service.id];
  const isDesktop = layout === "desktop";

  const measureContainer = useCallback(() => {
    const el = containerRef.current;
    if (!el) return null;
    const { width, height } = el.getBoundingClientRect();
    return { width, height };
  }, [containerRef]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const inner = innerRef.current;
    const size = containerSizeRef.current ?? measureContainer();

    setContentVisible(false);

    if (!inner || !originRect || !size) {
      onClose();
      return;
    }

    requestAnimationFrame(() => {
      inner.style.transition = `transform ${COLLAPSE_MS}ms ${EASE_OUT}`;
      inner.style.transform = tileToContainerTransform(
        originRect,
        size.width,
        size.height,
      );

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        inner.removeEventListener("transitionend", onTransitionEnd);
        onClose();
      };

      const onTransitionEnd = (event: TransitionEvent) => {
        if (event.target !== inner || event.propertyName !== "transform") return;
        finish();
      };

      inner.addEventListener("transitionend", onTransitionEnd);
      window.setTimeout(finish, COLLAPSE_MS + 40);
    });
  }, [measureContainer, onClose, originRect]);

  useLayoutEffect(() => {
    closingRef.current = false;
  }, [service.id]);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const size = measureContainer();

    if (!inner || !size || !originRect) {
      if (size) containerSizeRef.current = size;
      setExpanded(true);
      setContentVisible(true);
      return;
    }

    containerSizeRef.current = size;

    let cancelled = false;
    const collapsed = tileToContainerTransform(originRect, size.width, size.height);

    inner.style.transition = "none";
    inner.style.transform = collapsed;
    void inner.offsetHeight;

    const enterFrame = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        inner.style.transition = `transform ${EXPAND_MS}ms ${EASE}`;
        inner.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
        setExpanded(true);
      });
    });

    const contentTimer = window.setTimeout(() => {
      if (!cancelled) setContentVisible(true);
    }, CONTENT_DELAY_MS);

    return () => {
      cancelled = true;
      cancelAnimationFrame(enterFrame);
      window.clearTimeout(contentTimer);
    };
  }, [measureContainer, originRect, service.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const overlayFade = overlayFadeStyle(contentVisible);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
      role="region"
      aria-label={name}
    >
      <div
        ref={innerRef}
        className="pointer-events-auto absolute inset-0 origin-top-left overflow-hidden bg-[#1a0808] will-change-transform transform-gpu"
        style={
          originRect
            ? undefined
            : { transform: "translate3d(0, 0, 0) scale(1, 1)" }
        }
      >        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: expanded ? "scale(1)" : "scale(1.1)",
            transition: `transform ${EXPAND_MS}ms ${EASE}`,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 bg-black/35" style={overlayFade} aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/65"
          style={overlayFade}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20"
          style={overlayFade}
          aria-hidden
        />

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:right-5 sm:top-5"
          style={slideStyle(contentVisible, 60, 8)}
          aria-label={closeLabel}
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8"
          style={slideStyle(contentVisible, isDesktop ? 120 : 80, 24)}
        >
          <h3 className="font-heroCta text-[clamp(1.5rem,5vw,2.75rem)] font-normal leading-tight tracking-[0.01em] text-white">
            {name}
          </h3>
          <p className="mt-2 max-w-xl font-[var(--font-inquiry)] text-sm leading-relaxed text-white/90 sm:mt-3 sm:text-lg">
            {description}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => {
                onChooseService(service.cateringType);
                handleClose();
              }}
              className="h-11 min-h-[44px] rounded-lg bg-[rgba(89,0,0,0.9)] px-6 font-heroCta text-sm font-bold italic tracking-[0.03em] text-[rgba(210,210,210,0.95)] transition-colors hover:bg-[rgba(89,0,0,1)] sm:h-12 sm:text-base"
            >
              {chooseLabel}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex min-h-[44px] items-center gap-2 font-heroCta text-sm text-white/80 transition-colors hover:text-white sm:text-base"
            >              <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CateringServiceSlot({
  lang,
  layout,
  onChooseService,
  className,
}: {
  lang: "ID" | "EN";
  layout: "mobile" | "desktop";
  onChooseService: (cateringType: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [originRect, setOriginRect] = useState<ServiceOriginRect | null>(null);
  const isDesktop = layout === "desktop";

  const handleSelect = (
    service: Service,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const container = containerRef.current?.getBoundingClientRect();
    const tile = event.currentTarget.getBoundingClientRect();

    if (container) {
      setOriginRect({
        top: tile.top - container.top,
        left: tile.left - container.left,
        width: tile.width,
        height: tile.height,
      });
    } else {
      setOriginRect(null);
    }

    setActiveService(service);

    if (!isDesktop) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
  const handleClose = () => {
    setActiveService(null);
    setOriginRect(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        isDesktop ? "min-h-[900px]" : MOBILE_COLLAGE_H,
        className,
      )}
    >
      <ServiceCollage
        lang={lang}
        onSelect={handleSelect}
        layout={layout}
        className={cn("h-full", activeService ? "pointer-events-none" : undefined)}
      />
      {activeService ? (
        <ServiceExpandedPanel
          service={activeService}
          lang={lang}
          layout={layout}
          originRect={originRect}
          containerRef={containerRef}
          onClose={handleClose}
          onChooseService={onChooseService}
        />
      ) : null}
    </div>
  );
}
function CateringInquirySection() {
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

    const emailTrimmed = form.email.trim();
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
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
      const tipeLabel = CATERING_TYPES.find((t) => t.value === form.tipe)?.label ?? form.tipe;
      const message = encodeURIComponent(
        lang === "ID"
          ? `Halo Gadang Barubah, saya ingin konsultasi catering:\n\nNama: ${form.nama}\nTelepon: ${form.telepon}\nEmail: ${emailTrimmed || "-"}\nTipe: ${tipeLabel}\nPax: ${form.pax}`
          : `Hello Gadang Barubah, I want to discuss catering:\n\nName: ${form.nama}\nPhone: ${form.telepon}\nEmail: ${emailTrimmed || "-"}\nType: ${tipeLabel}\nPax: ${form.pax}`,
      );
      window.open(`https://wa.me/${COMPANY.whatsapp}?text=${message}`, "_blank");
      toast({
        title: lang === "ID" ? "Membuka WhatsApp" : "Opening WhatsApp",
        description:
          lang === "ID" ? "Lanjutkan pesan catering di WhatsApp." : "Continue your catering message on WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
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
          <CateringServiceSlot
            lang={lang}
            layout="mobile"
            onChooseService={handleChooseService}
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
          <CateringServiceSlot lang={lang} layout="desktop" onChooseService={handleChooseService} />
        </div>
      </div>
    </section>
  );
}

export default memo(CateringInquirySection);
