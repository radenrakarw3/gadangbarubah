import { useState } from 'react';
import Logo from './Logo';
import Mascot from './Mascot';
import Chatbox from './Chatbox';

export default function GadangBarubahPage() {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [mascotMessage, setMascotMessage] = useState('');
  const [isUniAnimating, setIsUniAnimating] = useState(false);

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleUniMessage = (message: string) => {
    setMascotMessage(message);
    setIsUniAnimating(true);
    
    // Clear message after some time
    setTimeout(() => {
      setMascotMessage('');
      setIsUniAnimating(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/20 rounded-full animate-bounce"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <header className="pt-8 pb-4" data-testid="header-section">
          <Logo />
        </header>
        
        {/* Main content area */}
        <main className="flex flex-col lg:flex-row items-center justify-center min-h-[60vh] px-4 gap-8">
          {/* Desktop: Mascot on left, Mobile: Mascot in center */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <Mascot 
              isAnimating={isUniAnimating}
              message={mascotMessage}
            />
          </div>
          
          {/* Welcome text - visible on larger screens */}
          <div className="hidden lg:block flex-1 max-w-md text-center lg:text-left space-y-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Selamat Datang!
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Bergabunglah dengan Uni dalam pengalaman interaktif di Gadang Barubah. 
              Mulai percakapan dan temukan apa yang membuat kami istimewa.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center space-x-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Uni siap membantu Anda</span>
              </div>
            </div>
          </div>
        </main>
        
        {/* Mobile welcome text */}
        <div className="lg:hidden px-6 py-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Selamat Datang!
          </h1>
          <p className="text-muted-foreground">
            Chat dengan Uni untuk memulai pengalaman Gadang Barubah Anda
          </p>
        </div>
      </div>
      
      {/* Chatbox */}
      <Chatbox 
        isVisible={isChatVisible}
        onToggle={handleChatToggle}
        onUniMessage={handleUniMessage}
      />
      
      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Gadang Barubah - Pengalaman yang Tak Terlupakan
        </p>
      </footer>
    </div>
  );
}