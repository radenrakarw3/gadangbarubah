import { useState, useEffect } from 'react';
import { MessageCircle, ArrowDown, X, MapPin, Truck, Handshake, Crown, UtensilsCrossed, Sparkles, Star, Zap } from 'lucide-react';
import uniMascotImage from '@assets/ChatGPT Image Sep 22, 2025, 11_37_20 PM_1758584495417.png';

export function AnimatedUni() {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    // Show speech bubble after 2 seconds
    const timer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSpeechBubble) {
        setShowSpeechBubble(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSpeechBubble]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-8 mb-8">
      {/* Animated Uni Mascot - Mobile: Center, Desktop: Left side */}
      <div className="relative inline-block text-center lg:text-left">
        {/* Outer wrapper for float animation */}
        <div className="animate-float motion-reduce:animate-none">
          {/* Inner wrapper for hover effects */}
          <div className="hover:animate-wave motion-reduce:hover:animate-none transition-all duration-300 hover:scale-105 cursor-pointer">
            <img 
              src={uniMascotImage}
              alt="Uni - Mascot resmi Gadang Barubah Restaurant dengan pakaian tradisional Minangkabau"
              className="w-64 sm:w-80 h-auto mx-auto rounded-lg shadow-lg"
              data-testid="img-uni-mascot"
              onClick={() => setShowSpeechBubble(!showSpeechBubble)}
            />
          </div>
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute top-4 right-4 animate-ping motion-reduce:animate-none hidden sm:block">
          <Sparkles className="w-5 h-5 text-[hsl(var(--minang-gold-primary))]" />
        </div>
        <div className="absolute top-8 left-6 animate-pulse delay-500 motion-reduce:animate-none hidden sm:block">
          <Star className="w-4 h-4 text-[hsl(var(--minang-gold-primary))]" />
        </div>
        <div className="absolute bottom-8 right-8 animate-bounce delay-1000 motion-reduce:animate-none hidden sm:block">
          <Zap className="w-5 h-5 text-[hsl(var(--minang-gold-primary))]" />
        </div>
      </div>

      {/* Speech Bubble - Mobile: Below mascot, Desktop: Side by side */}
      {showSpeechBubble && (
        <div 
          className="mt-6 lg:mt-0 lg:ml-0 animate-bounce-in motion-reduce:animate-none"
          data-testid="speech-bubble-container"
          role="note"
          aria-live="polite"
        >
          <div className="relative bg-white dark:bg-gray-800 border-2 border-[hsl(var(--minang-gold-primary))] border-opacity-30 rounded-2xl p-4 shadow-lg max-w-sm mx-auto lg:mx-0">
            {/* Close Button */}
            <button 
              onClick={() => setShowSpeechBubble(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Tutup pesan Uni"
              data-testid="button-close-speech-bubble"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
            
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2" data-testid="text-uni-greeting">
              <MessageCircle className="w-4 h-4 text-[hsl(var(--minang-gold-primary))]" />
              Halo! Saya Uni
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3" data-testid="text-service-intro">
              Di <span className="font-semibold text-[hsl(var(--minang-gold-primary))]">"Jelajahi Layanan Kami"</span> kamu bisa menemukan:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 mb-3">
              <li className="flex items-center gap-2" data-testid="service-item-outlet">
                <MapPin className="w-3 h-3 text-[hsl(var(--minang-gold-primary))]" />
                Lokasi Outlet Terbaik
              </li>
              <li className="flex items-center gap-2" data-testid="service-item-delivery">
                <Truck className="w-3 h-3 text-[hsl(var(--minang-gold-primary))]" />
                Delivery ke Rumah
              </li>
              <li className="flex items-center gap-2" data-testid="service-item-partnership">
                <Handshake className="w-3 h-3 text-[hsl(var(--minang-gold-primary))]" />
                Partnership Bisnis
              </li>
              <li className="flex items-center gap-2" data-testid="service-item-membership">
                <Crown className="w-3 h-3 text-[hsl(var(--minang-gold-primary))]" />
                VIP Membership
              </li>
              <li className="flex items-center gap-2" data-testid="service-item-catering">
                <UtensilsCrossed className="w-3 h-3 text-[hsl(var(--minang-gold-primary))]" />
                Catering Event
              </li>
            </ul>
            <div className="flex items-center justify-center gap-1 text-[hsl(var(--minang-gold-primary))] text-xs font-medium" data-testid="text-call-to-action">
              <ArrowDown className="w-3 h-3 animate-bounce motion-reduce:animate-none" />
              Klik tombol di bawah yuk!
            </div>
            
            {/* Speech bubble tail - adaptive positioning */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800 lg:hidden"></div>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white dark:border-l-gray-800 hidden lg:block"></div>
          </div>
        </div>
      )}
    </div>
  );
}