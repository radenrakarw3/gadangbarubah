import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, ArrowLeft, Store, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import Logo from '../Logo';
import SEOHead from '../SEOHead';
import { useState, useEffect, useRef } from 'react';

// Import restaurant photos
import exteriorImage from '@assets/DSC07220_1758567803910.jpg';
import interiorMain from '@assets/DSC03165_1758567860370.jpg';
import vipRoom from '@assets/DSC03147_1758567860387.jpg';
import customersEating from '@assets/DSC05515_1758567860387.jpg';
import waiterService from '@assets/DSC04478_1758567860387.jpg';
import menuDisplay from '@assets/DSC03155_1758567860387.jpg';
import familyDining from '@assets/DSC03214_1758567860387.jpg';
import elegantDining from '@assets/DSC03262_1758567860387.jpg';
import boothSeating from '@assets/DSC03081_1758567885552.jpg';
import streetView from '@assets/DSC03078_1758567885565.jpg';
import buffetArea from '@assets/DSC03388_1758567885565.jpg';

export default function OutletPage() {
  const [, navigate] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const atmosphereImages = [
    {
      src: exteriorImage,
      title: "Eksterior Modern",
      description: "Desain bangunan contemporary dengan signage yang ikonik dan landscaping yang memukau"
    },
    {
      src: interiorMain,
      title: "Interior Berkelas",
      description: "Suasana interior rumah makan Padang dengan konsep warna hangat dan buffet area nasi padang yang elegan"
    },
    {
      src: vipRoom,
      title: "VIP Private Room",
      description: "Ruang VIP eksklusif dengan poster khas Gadang Barubah untuk acara khusus"
    },
    {
      src: customersEating,
      title: "Suasana Bersantap",
      description: "Momen kebersamaan keluarga menikmati hidangan dengan suasana yang nyaman"
    },
    {
      src: waiterService,
      title: "Pelayanan Prima",
      description: "Staff profesional memberikan pelayanan berkualitas dengan menu signature masakan Minang kami"
    },
    {
      src: menuDisplay,
      title: "Menu Berkualitas",
      description: "Menu bergizi dengan presentasi yang menarik di booth seating yang nyaman"
    },
    {
      src: familyDining,
      title: "Family Dining",
      description: "Pengalaman makan bersama dengan berbagai pilihan nasi padang dan hidangan khas Minang autentik"
    },
    {
      src: elegantDining,
      title: "Elegant Atmosphere",
      description: "Area dining dengan glass partition dan pencahayaan ambient yang hangat"
    },
    {
      src: boothSeating,
      title: "Booth Seating",
      description: "Area booth pribadi dengan desain orange yang khas dan table numbering"
    },
    {
      src: streetView,
      title: "Lokasi Strategis",
      description: "Terletak di lokasi strategis dengan akses mudah dan view ke jalan raya"
    },
    {
      src: buffetArea,
      title: "Buffet Counter",
      description: "Area buffet lengkap dengan berbagai pilihan hidangan fresh daily"
    }
  ];

  const pauseAndResume = () => {
    setIsAutoSliding(false);
    // Clear existing timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    // Set new timeout to resume
    resumeTimeoutRef.current = setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % atmosphereImages.length);
    pauseAndResume();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + atmosphereImages.length) % atmosphereImages.length);
    pauseAndResume();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    pauseAndResume();
  };

  // Auto-slide every 5 seconds when enabled
  useEffect(() => {
    if (!isAutoSliding) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % atmosphereImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [atmosphereImages.length, isAutoSliding]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentSlide + 1) % atmosphereImages.length;
      const prevIndex = (currentSlide - 1 + atmosphereImages.length) % atmosphereImages.length;
      
      [nextIndex, prevIndex].forEach(index => {
        const img = new Image();
        img.src = atmosphereImages[index].src;
      });
    };
    
    preloadImages();
  }, [currentSlide, atmosphereImages]);

  const locations = [
    {
      name: "Gadang Barubah Pollux Mall Cikarang",
      address: "Main Gate, Mall Cikarang, Jl. Raya Cikarang - Cibarusah, Pasirsari, Cikarang Sel., Kabupaten Bekasi, Jawa Barat 17530 Pollux, Lantai GF",
      phone: "0895-0976-6739",
      hours: "10:00 - 22:00",
      icon: Store,
      type: "Restoran Unggulan",
      description: "Outlet flagship kami di Mall Cikarang dengan konsep berkelas dan VIP room eksklusif.",
      googleMaps: "https://maps.app.goo.gl/jP1JMKQZBU9AXSLz5"
    },
    {
      name: "Gadang Barubah Bintaro",
      address: "Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15412",
      phone: "0895-0976-6739",
      hours: "10:00 - 22:00",
      icon: Store,
      type: "Cabang Bintaro",
      description: "Cabang Bintaro kami menghadirkan cita rasa Minang autentik dengan suasana hangat untuk keluarga dan komunitas.",
      googleMaps: "https://maps.google.com/?q=Jl.+Menteng+Raya+No.28+Blok+FG+Jurang+Mangu+Barat"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="outlet" />
      
      {/* Top section with back button and logo */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1 text-sm">Kembali</span>
          </Button>
          
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-light text-foreground mb-6">
              Dua Cabang Gadang Barubah
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Kini hadir di Pollux Mall Cikarang dan Bintaro — nikmati pengalaman bersantap Minang autentik di cabang terdekat Anda
            </p>
          </div>

          {/* Location Info */}
          <div className="max-w-2xl mx-auto mb-12">
            {locations.map((location, index) => {
              const LocationIcon = location.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-500 border-border/30 hover:border-primary/30 bg-gradient-to-br from-background to-muted/10 hover-elevate"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20">
                          <LocationIcon className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                            {location.name}
                          </h3>
                          <p className="text-sm font-medium text-primary mb-3">{location.type}</p>
                          <p className="text-base text-muted-foreground leading-relaxed mb-6">
                            {location.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{location.phone}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">Buka: {location.hours}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            className="bg-primary hover:bg-primary/90 transition-all duration-300 px-6"
                            onClick={() => {
                              const message = encodeURIComponent('Halo, saya tertarik untuk buat reservasi di Gadang Barubah. Mohon informasi lebih lanjut.');
                              const whatsAppUrl = `https://api.whatsapp.com/send?phone=6289509766739&text=${message}`;
                              window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
                            }}
                            data-testid={`button-reservation-${index}`}
                          >
                            Buat Reservasi
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-primary/30 hover:border-primary/50 px-6"
                            onClick={() => window.open(location.googleMaps, '_blank', 'noopener,noreferrer')}
                            data-testid={`button-maps-${index}`}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Google Maps
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Atmosphere Slideshow */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-6">
                Suasana & Atmosfer
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Jelajahi berbagai sudut dan suasana outlet unggulan kami yang dirancang untuk kenyamanan Anda
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={atmosphereImages[currentSlide].src}
                  alt={atmosphereImages[currentSlide].title}
                  className="w-full h-full object-cover transition-all duration-500"
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                  fetchPriority={currentSlide === 0 ? "high" : "low"}
                  decoding="async"
                  width="768"
                  height="768"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-2xl font-serif font-medium mb-2">
                    {atmosphereImages[currentSlide].title}
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed">
                    {atmosphereImages[currentSlide].description}
                  </p>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 shadow-lg z-10"
                data-testid="button-prev-slide"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 shadow-lg z-10"
                data-testid="button-next-slide"
                aria-label="Foto selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Slide Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {atmosphereImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-primary w-8' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    data-testid={`indicator-${index}`}
                    aria-label={`Pergi ke foto ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* VIP Room Section */}
          <div className="mb-16">
            <Card className="border-border/30 shadow-xl bg-gradient-to-br from-background to-muted/10">
              <CardContent className="p-10">
                <div className="flex items-center justify-center mb-8">
                  <Crown className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-3xl font-serif font-medium text-foreground">
                    VIP Private Room
                  </h2>
                </div>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Nikmati pengalaman bersantap eksklusif di ruang VIP pribadi kami yang dirancang khusus untuk acara istimewa, pertemuan bisnis, atau momen keluarga yang berkesan.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">6-12</span>
                          </div>
                          <span className="text-sm text-muted-foreground">Kapasitas Tamu</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Store className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">Area Privat</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">Personal Service</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Crown className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">Menu Khusus</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 px-8"
                      onClick={() => {
                        const message = encodeURIComponent('Halo, saya tertarik untuk reservasi VIP Room di Gadang Barubah. Mohon informasi lebih lanjut.');
                        const whatsAppUrl = `https://api.whatsapp.com/send?phone=6289509766739&text=${message}`;
                        window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
                      }}
                      data-testid="button-vip-reservation"
                    >
                      Reservasi VIP Room
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={vipRoom}
                      alt="VIP Private Room"
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}