import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackContactMethod } from '@/lib/analytics';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if popup has been closed before
    const popupClosed = localStorage.getItem('gadang-barubah-promo-closed');
    
    if (!popupClosed) {
      // Show popup after 30 seconds if not previously closed
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
    // Remember that user closed the popup - won't show again until refresh/revisit
    localStorage.setItem('gadang-barubah-promo-closed', 'true');
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
          className="relative bg-gradient-to-b from-[#4a1515] via-[#3f1113] to-[#2d0a0c] rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden border border-yellow-400"
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

          {/* Decorative Golden Corners - matching design */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="w-full h-full border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-yellow-400"></div>
            <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-yellow-400"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="w-full h-full border-r-4 border-t-4 border-yellow-400 rounded-tr-2xl"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-yellow-400"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-yellow-400"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16">
            <div className="w-full h-full border-l-4 border-b-4 border-yellow-400 rounded-bl-2xl"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-yellow-400"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-yellow-400"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="w-full h-full border-r-4 border-b-4 border-yellow-400 rounded-br-2xl"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-yellow-400"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-yellow-400"></div>
          </div>

          {/* Content matching exact design */}
          <div className="p-6 pt-12 text-center">
            {/* Logo/Brand matching design */}
            <div className="mb-6">
              <div className="text-yellow-400 font-serif text-xl font-bold tracking-wider">
                ✦<br />
                GADANG<br />BARUBAH
              </div>
            </div>

            {/* Main Title - exact text from design */}
            <h2 className="text-yellow-400 font-bold text-3xl sm:text-4xl mb-4 leading-tight tracking-wide">
              GRATIS DESSERT<br />KLEPON!
            </h2>

            {/* Subtitle - exact text from design */}
            <p className="text-white text-sm sm:text-base mb-6 leading-relaxed px-2">
              Belanja di atas Rp100.000 di Gadang Barubah,<br />
              langsung dapat Klepon manis <span className="text-yellow-400 font-semibold">GRATIS!</span>
            </p>

            {/* Klepon visual representation matching design */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                {/* Bowl matching design */}
                <div className="w-40 h-24 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-full border-2 border-amber-700 shadow-lg"></div>
                
                {/* 3 Klepon balls matching design exactly */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full shadow-md border border-green-300 relative">
                    {/* Coconut texture */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-300/40 to-transparent"></div>
                    <div className="absolute inset-2 rounded-full bg-green-200/20"></div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full shadow-md border border-green-300 -mt-3 relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-300/40 to-transparent"></div>
                    <div className="absolute inset-2 rounded-full bg-green-200/20"></div>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full shadow-md border border-green-300 relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-300/40 to-transparent"></div>
                    <div className="absolute inset-2 rounded-full bg-green-200/20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - exact design */}
            <Button
              onClick={handleOrderNow}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-base sm:text-lg rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200"
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