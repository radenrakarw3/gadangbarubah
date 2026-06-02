/** Placeholder ringan saat chunk route dimuat */
export default function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-[#300505]">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-gold/40 border-t-gold"
        role="status"
        aria-label="Memuat halaman"
      />
    </div>
  );
}
