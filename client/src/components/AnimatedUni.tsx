import { useState, useEffect } from 'react';
import { MessageCircle, ArrowDown } from 'lucide-react';
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

  return (
    <div className="relative text-center mb-8">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-in">
          <div className="relative bg-white dark:bg-gray-800 border-2 border-gold/30 rounded-2xl p-4 shadow-lg max-w-xs">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gold" />
              Halo! Saya Uni 👋
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              Di <span className="font-semibold text-gold">"Jelajahi Layanan Kami"</span> kamu bisa menemukan:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 mb-3">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                📍 Lokasi Outlet Premium
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                🚚 Delivery ke Rumah
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                🤝 Partnership Bisnis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                👑 VIP Membership
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                🍽️ Catering Event
              </li>
            </ul>
            <div className="flex items-center justify-center gap-1 text-gold text-xs font-medium">
              <ArrowDown className="w-3 h-3 animate-bounce" />
              Klik tombol di bawah yuk!
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
        </div>
      )}
      
      {/* Animated Uni Mascot */}
      <div className="relative inline-block">
        <img 
          src={uniMascotImage}
          alt="Uni - Mascot resmi Gadang Barubah Restaurant dengan pakaian tradisional Minangkabau"
          className="w-64 sm:w-80 h-auto mx-auto rounded-lg shadow-lg 
                     animate-float hover:animate-wave transition-all duration-300
                     hover:scale-105 cursor-pointer"
          data-testid="img-uni-mascot"
          onClick={() => setShowSpeechBubble(!showSpeechBubble)}
        />
        
        {/* Floating sparkles */}
        <div className="absolute top-4 right-4 animate-ping">
          <span className="text-gold text-lg">✨</span>
        </div>
        <div className="absolute top-8 left-6 animate-pulse delay-500">
          <span className="text-gold text-sm">⭐</span>
        </div>
        <div className="absolute bottom-8 right-8 animate-bounce delay-1000">
          <span className="text-gold text-base">💫</span>
        </div>
      </div>
    </div>
  );
}