import { useState, useEffect } from "react";
import mascotImage from "@assets/ChatGPT Image Sep 22, 2025, 11_45_23 PM_1758562271953.png";

interface MascotProps {
  isAnimating?: boolean;
  message?: string;
}

export default function Mascot({ isAnimating = false, message }: MascotProps) {
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'talking' | 'waving'>('idle');
  
  useEffect(() => {
    if (isAnimating) {
      setCurrentAnimation('talking');
      const timer = setTimeout(() => {
        setCurrentAnimation('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, message]);

  useEffect(() => {
    // Random idle animations
    const interval = setInterval(() => {
      if (currentAnimation === 'idle') {
        const randomActions = ['idle', 'waving'];
        const randomAction = randomActions[Math.floor(Math.random() * randomActions.length)] as 'idle' | 'waving';
        if (randomAction === 'waving') {
          setCurrentAnimation('waving');
          setTimeout(() => setCurrentAnimation('idle'), 1500);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentAnimation]);

  const getAnimationStyle = () => {
    switch (currentAnimation) {
      case 'talking':
        return { animation: 'talking 0.3s ease-in-out infinite' };
      case 'waving':
        return { animation: 'wave 1.5s ease-in-out' };
      default:
        return { animation: 'idleBreathe 4s ease-in-out infinite' };
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center">
        <div className="relative">
          <img
            src={mascotImage}
            alt="Uni - Mascot Gadang Barubah"
            className="w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem] xl:max-w-[24rem] h-auto object-contain transition-transform duration-300"
            style={getAnimationStyle()}
            data-testid="mascot-uni"
          />
          
          {message && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-accent text-accent-foreground px-4 py-3 rounded-xl max-w-[min(20rem,90vw)] text-center font-medium break-words z-10">
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-accent"></div>
              {message}
            </div>
          )}
        </div>
      </div>
        
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes idleBreathe {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-5px) scale(1.02);
            }
          }
          
          @keyframes talking {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes wave {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-5deg);
            }
            75% {
              transform: rotate(5deg);
            }
          }
        `
      }} />
    </>
  );
}