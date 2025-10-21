import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSlideshowProps {
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  interval?: number;
}

export default function ImageSlideshow({ images, interval = 5000 }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Start with first image

  // Preload adjacent images (prev/next) for smoother transitions
  const preloadAdjacentImages = useCallback((index: number) => {
    const prevIndex = index === 0 ? images.length - 1 : index - 1;
    const nextIndex = index === images.length - 1 ? 0 : index + 1;
    
    [prevIndex, nextIndex].forEach(idx => {
      if (!loadedImages.has(idx)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(idx));
        };
        img.src = images[idx].src;
      }
    });
  }, [images, loadedImages]);

  // Preload adjacent images when current index changes
  useEffect(() => {
    preloadAdjacentImages(currentIndex);
  }, [currentIndex, preloadAdjacentImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-black/5">
        <div className="relative w-full pb-[75%] sm:pb-[66.67%] md:pb-[56.25%]"> {/* Mobile: 4:3, Tablet: 3:2, Desktop: 16:9 */}
          {images.map((image, index) => {
            const isVisible = index === currentIndex;
            const shouldLoad = index === 0 || loadedImages.has(index) || isVisible;
            
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {shouldLoad && (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding={index === 0 ? "sync" : "async"}
                    width="960"
                    height="640"
                    data-testid={`img-slide-${index}`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white pointer-events-none">
                  <p className="text-base md:text-lg lg:text-xl font-serif font-light text-center">
                    {image.caption}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Slide indicators */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white/90 w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                data-testid={`button-slide-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons - positioned relative to slideshow container */}
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 backdrop-blur-md text-white hover:text-white shadow-xl transition-all duration-300 hover:scale-110 z-20"
          data-testid="button-prev-slide"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 backdrop-blur-md text-white hover:text-white shadow-xl transition-all duration-300 hover:scale-110 z-20"
          data-testid="button-next-slide"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
    </div>
  );
}