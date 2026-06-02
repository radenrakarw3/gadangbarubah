/** Fallback ringan saat chunk rute sedang dimuat. */
export default function RouteFallback() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center bg-[#300505] text-ivory/70 text-sm"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      Memuat…
    </div>
  );
}
