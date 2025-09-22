import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackContactMethod } from '@/lib/analytics';
import kleponPromoImage from '@assets/ChatGPT Image Sep 23, 2025, 03_49_24 AM_1758581441623.png';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation to complete
  };

  const handleOrderNow = () => {
    // Track promo click for analytics
    trackContactMethod('whatsapp', 'promo_popup', {
      event_category: 'promo_interaction',
      event_label: 'klepon_dessert_promo',
      service_type: 'delivery',
      restaurant_action: 'whatsapp'
    });

    // WhatsApp order link
    const message = encodeURIComponent('Halo! Saya tertarik dengan promo GRATIS Dessert Klepon untuk pembelian di atas Rp100.000. Mohon informasi lebih lanjut.');
    const whatsAppUrl = `https://api.whatsapp.com/send?phone=6289509766739&text=${message}`;
    window.open(whatsAppUrl, '_blank');
    
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Popup Container */}
      <div 
        className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div 
          className="relative bg-gradient-to-b from-red-900 to-red-950 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-yellow-400"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors duration-200"
            data-testid="button-close-promo"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Decorative Golden Corners */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="w-full h-full border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="w-full h-full border-r-4 border-t-4 border-yellow-400 rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16">
            <div className="w-full h-full border-l-4 border-b-4 border-yellow-400 rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="w-full h-full border-r-4 border-b-4 border-yellow-400 rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
          </div>

          {/* Content */}
          <div className="p-6 pt-12 text-center">
            {/* Logo/Brand */}
            <div className="mb-6">
              <div className="text-yellow-400 font-serif text-lg font-bold tracking-wider">
                GADANG<br />BARUBAH
              </div>
            </div>

            {/* Main Title */}
            <h2 className="text-yellow-400 font-bold text-2xl sm:text-3xl mb-4 leading-tight">
              GRATIS DESSERT<br />KLEPON!
            </h2>

            {/* Subtitle */}
            <p className="text-white text-sm sm:text-base mb-6 leading-relaxed px-2">
              Belanja di atas Rp100.000 di Gadang Barubah,<br />
              langsung dapat Klepon manis <span className="text-yellow-400 font-semibold">GRATIS!</span>
            </p>

            {/* Klepon Image */}
            <div className="mb-6 flex justify-center">
              <img 
                src={kleponPromoImage} 
                alt="Klepon Dessert Gratis" 
                className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-full shadow-lg border-2 border-yellow-400"
              />
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleOrderNow}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-base sm:text-lg border-2 border-yellow-400 hover:border-yellow-300 transition-all duration-200 hover-elevate"
              data-testid="button-order-promo"
            >
              PESAN SEKARANG
            </Button>

            {/* Fine Print */}
            <p className="text-yellow-200/80 text-xs mt-4 px-2">
              *Syarat dan ketentuan berlaku. Berlaku untuk pembelian minimum Rp100.000
            </p>
          </div>
        </div>
      </div>
    </>
  );
}