import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";

export default function Logo() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative">
        <img
          src={logoImage}
          alt="Logo Gadang Barubah - Rumah Makan Padang Cikarang"
          className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain animate-pulse"
          loading="eager"
          fetchPriority="high"
          width="192"
          height="192"
          data-testid="logo-image"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.3))',
            animation: 'breathingGlow 3s ease-in-out infinite'
          }}
        />
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes breathingGlow {
            0%, 100% {
              filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 30px rgba(255, 165, 0, 0.5));
            }
          }
        `
      }} />
    </div>
  );
}