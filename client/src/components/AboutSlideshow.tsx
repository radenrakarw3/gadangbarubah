import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface AboutSlideshowProps {
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  content: {
    title: string;
    paragraphs: string[];
  };
  interval?: number;
}

export default function AboutSlideshow({ images, content, interval = 5000 }: AboutSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [imageOrientations, setImageOrientations] = useState<Map<number, 'portrait' | 'landscape'>>(new Map());
  
  // Use refs for touch tracking to avoid re-renders during swipe
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  // Create stable image source array for dependency
  const imageSources = useMemo(() => images.map(img => img.src), [images]);

  // Detect image orientation (update per-image as they load)
  useEffect(() => {
    let mounted = true;

    images.forEach((image, index) => {
      const img = new Image();
      
      img.onload = () => {
        if (!mounted) return;
        const orientation = img.naturalWidth < img.naturalHeight ? 'portrait' : 'landscape';
        
        // Update immediately per-image (not batched)
        setImageOrientations(prev => new Map(prev).set(index, orientation));
        setLoadedImages(prev => new Set(prev).add(index));
      };

      img.onerror = () => {
        if (!mounted) return;
        // Default to landscape on error to avoid blocking
        setImageOrientations(prev => new Map(prev).set(index, 'landscape'));
        setLoadedImages(prev => new Set(prev).add(index));
      };
      
      img.src = image.src;
    });

    return () => {
      mounted = false;
    };
  }, [imageSources]); // Depend on stable image sources array

  // Preload adjacent images
  const preloadAdjacentImages = useCallback((index: number) => {
    const prevIndex = index === 0 ? images.length - 1 : index - 1;
    const nextIndex = index === images.length - 1 ? 0 : index + 1;
    
    [prevIndex, nextIndex].forEach(idx => {
      if (!loadedImages.has(idx)) {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(idx));
        };
        img.onerror = () => {
          setLoadedImages(prev => new Set(prev).add(idx));
        };
        img.src = images[idx].src;
      }
    });
  }, [images, loadedImages]);

  useEffect(() => {
    preloadAdjacentImages(currentIndex);
  }, [currentIndex, preloadAdjacentImages]);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Touch event handlers for swipe - using refs for smooth gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else if (isRightSwipe) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }

    // Reset refs
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const currentImage = images[currentIndex];
  const currentOrientation = imageOrientations.get(currentIndex) || 'landscape';
  const isPortrait = currentOrientation === 'portrait';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-medium text-foreground mb-4">{content.title}</h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
      </div>

      {isPortrait ? (
        // Portrait layout: side-by-side
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-xl shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="aspect-[3/4] relative">
              {images.map((image, index) => {
                const isVisible = index === currentIndex;
                const shouldLoad = loadedImages.has(index);
                
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
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                        data-testid={`img-about-slide-${index}`}
                      />
                    )}
                  </div>
                );
              })}

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white/90 w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    data-testid={`button-about-slide-${index}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {content.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            {currentImage.caption && (
              <p className="text-sm italic text-muted-foreground/80 border-l-4 border-primary/30 pl-4">
                {currentImage.caption}
              </p>
            )}
          </div>
        </div>
      ) : (
        // Landscape layout: stacked
        <div className="space-y-8">
          {/* Image full width */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-xl shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="aspect-[16/9] relative">
              {images.map((image, index) => {
                const isVisible = index === currentIndex;
                const shouldLoad = loadedImages.has(index);
                
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
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                        data-testid={`img-about-slide-${index}`}
                      />
                    )}
                  </div>
                );
              })}

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white/90 w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    data-testid={`button-about-slide-${index}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content below */}
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {content.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            {currentImage.caption && (
              <p className="text-sm italic text-muted-foreground/80 border-l-4 border-primary/30 pl-4">
                {currentImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
