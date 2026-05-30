import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import type { HomeBootPhase } from "@/lib/homePreload";

interface HomePageLoaderProps {
  progress: number;
  phase?: HomeBootPhase;
  exiting?: boolean;
}

const PHASE_LABEL: Record<HomeBootPhase, string> = {
  assets: "Mengunduh aset",
  render: "Menyiapkan tampilan",
  ready: "Hampir selesai",
};

export default function HomePageLoader({
  progress,
  phase = "assets",
  exiting = false,
}: HomePageLoaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-maroon-deep transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      <div className="flex flex-col items-center gap-8 px-6">
        <img
          src={logoImage}
          alt="Gadang Barubah"
          className="h-16 sm:h-20 w-auto object-contain brightness-110"
          width={160}
          height={80}
          decoding="async"
        />

        <div className="w-52 sm:w-60">
          <div className="h-[2px] w-full bg-ivory/15 overflow-hidden rounded-full">
            <div
              className="h-full bg-gold transition-[width] duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-center text-ivory/70 text-xs uppercase tracking-[0.25em] font-medium">
            {PHASE_LABEL[phase]}
          </p>
          <p className="mt-1 text-center text-ivory/40 text-[10px] tabular-nums">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
