import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import promoImage from '@assets/ChatGPT Image Sep 23, 2025, 03_49_24 AM_1758658476399.png';

interface PromotionalPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function PromotionalPopup({ isVisible, onClose }: PromotionalPopupProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 will-change-opacity' : 'opacity-0'
      }`}
      onClick={onClose}
      data-testid="popup-overlay"
    >
      <div 
        className={`relative mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100 will-change-transform' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white/90 hover:bg-white border-2 border-white shadow-lg rounded-full w-8 h-8"
          data-testid="button-close-popup"
          aria-label="Tutup popup"
        >
          <X className="h-4 w-4 text-gray-700" />
        </Button>

        {/* Promotional Image */}
        <div className="relative overflow-hidden rounded-lg shadow-2xl max-w-lg w-full">
          <img
            src={promoImage}
            alt="Gratis Dessert Klepon - Belanja di atas Rp100.000 di Gadang Barubah langsung dapat Klepon manis GRATIS"
            className="w-full h-auto object-contain"
            loading="eager"
            decoding="async"
            width="500"
            height="500"
            data-testid="img-promo-popup"
          />
        </div>
      </div>
    </div>
  );
}