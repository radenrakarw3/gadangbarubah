import { useState, useEffect } from 'react';

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
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  // Preload all images for smooth transitions
  useEffect(() => {
    const preloadImages = async () => {
      const promises = images.map((image) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(image.src);
          img.onerror = reject;
          img.src = image.src;
        });
      });
      
      try {
        const loaded = await Promise.all(promises);
        setPreloadedImages(loaded);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setPreloadedImages(images.map(img => img.src));
      }
    };

    preloadImages();
  }, [images]);

  useEffect(() => {
    if (preloadedImages.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, preloadedImages]);

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg aspect-square md:aspect-video w-full max-w-lg md:max-w-4xl mx-auto">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover object-center md:object-top"
            loading="eager"
            data-testid={`img-slide-${index}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-lg sm:text-xl font-serif font-light text-center">
              {image.caption}
            </p>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
  );
}