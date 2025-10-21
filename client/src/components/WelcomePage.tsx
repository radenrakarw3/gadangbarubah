import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, Download, FileText, UtensilsCrossed, ShoppingBag, Package, Eye, MessageCircle, Gift, Star, Users as UsersIcon, Store, Truck, Handshake, Crown, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import SEOHead from './SEOHead';
import ImageSlideshow from './ImageSlideshow';
import PromotionalPopup from './PromotionalPopup';
import StickyNav from './StickyNav';
import FloatingWhatsApp from './FloatingWhatsApp';
import image1 from '@assets/DSC07140_1758564407964.jpg';
import image2 from '@assets/DSC02436_1758564588903.jpg';
import image3 from '@assets/DSC02371_1758564588950.jpg';
import image4 from '@assets/DSC07168_1758564588951.jpg';
import image5 from '@assets/DSC07153_1758564588952.jpg';
import image6 from '@assets/DSC07152_1758564588952.jpg';
import image7 from '@assets/DSC07130_1758564588953.jpg';
import restaurantExterior from '@assets/DSC07220_1758565473982.jpg';
import restaurantNight from '@assets/DSC05600_1758565473997.jpg';
import menuPdf from '@assets/Menu Gadang Digital 5 September 2025_1758627992252.pdf';
import nasiTumpengImage from '@assets/Nasi Tumpeng_1758628102631.png';
import nasiBoxImage from '@assets/Nasi Box_1758628102653.jpg';
import rendangKiloanImage from '@assets/DSC02799_1758628102653.jpg';
import { AnimatedUni } from './AnimatedUni';
import { trackContactMethod, trackServiceView } from '@/lib/analytics';

const services = [
  {
    id: 'outlet',
    name: 'Outlet Location',
    icon: Store,
    description: 'Kunjungi rumah makan Padang kami di Pollux Mall Cikarang dengan suasana mewah, VIP room eksklusif, dan pengalaman kuliner nasi padang yang tak terlupakan.',
    path: '/services/outlet'
  },
  {
    id: 'delivery',
    name: 'Delivery Service',
    icon: Truck,
    description: 'Nikmati kelezatan nasi padang, rendang, dan gulai berkualitas restoran langsung di rumah Anda dengan layanan antar yang menjaga cita rasa autentik.',
    path: '/services/delivery'
  },
  {
    id: 'partnership',
    name: 'Business Partnership',
    icon: Handshake,
    description: 'Bergabunglah dalam ekosistem kuliner Padang kami dengan program kemitraan rumah makan yang memberikan keuntungan berkelanjutan.',
    path: '/services/partnership'
  },
  {
    id: 'membership',
    name: 'VIP Membership',
    icon: Crown,
    description: 'Dapatkan akses eksklusif ke benefit istimewa, reservasi prioritas untuk nasi padang, dan pengalaman kuliner Minang yang dipersonalisasi.',
    path: '/services/membership'
  },
  {
    id: 'catering',
    name: 'Event Catering',
    icon: UtensilsCrossed,
    description: 'Wujudkan acara istimewa Anda dengan layanan katering nasi padang dan masakan Minang yang menciptakan momen tak terlupakan.',
    path: '/services/catering'
  }
];

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  const handleServiceClick = (service: typeof services[0]) => {
    // Services that redirect to WhatsApp
    const whatsAppServices = ['delivery', 'partnership', 'catering'];
    const whatsAppNumber = '6289509766739';
    
    if (whatsAppServices.includes(service.id)) {
      trackContactMethod('whatsapp', 'services_hub', {
        service_type: service.id as any,
        restaurant_action: service.id === 'delivery' ? 'delivery' : 'whatsapp',
        outlet_name: 'Gadang Barubah',
        event_label: `whatsapp_${service.id}`
      });
      
      const message = encodeURIComponent(`Halo, saya tertarik dengan layanan ${service.name} dari Gadang Barubah. Mohon informasi lebih lanjut.`);
      const whatsAppUrl = `https://api.whatsapp.com/send?phone=${whatsAppNumber}&text=${message}`;
      window.open(whatsAppUrl, '_blank');
    } else {
      trackServiceView(service.id === 'membership' ? 'vip_membership' : 'outlet', {
        event_label: `navigate_${service.id}`,
        custom_parameter_1: 'services_hub_navigation'
      });
      
      navigate(service.path);
    }
  };

  // Scroll detection to show popup at middle of page with performance optimization
  useEffect(() => {
    if (hasShownPopup) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollPercentage = scrollTop / (documentHeight - windowHeight);

          // Show popup when user scrolls to 50% of the page
          if (scrollPercentage >= 0.5 && !hasShownPopup) {
            setShowPromoPopup(true);
            setHasShownPopup(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownPopup]);

  const handleClosePopup = () => {
    setShowPromoPopup(false);
  };


  const slideshowImages = [
    {
      src: image1,
      alt: "Nasi padang dan rendang autentik Minangkabau di Gadang Barubah",
      caption: "Cita Rasa Nasi Padang Autentik yang Tak Terlupakan"
    },
    {
      src: image2,
      alt: "Presentasi masakan Padang berkualitas dengan minuman segar",
      caption: "Presentasi Berkelas dengan Cita Rasa Istimewa"
    },
    {
      src: image3,
      alt: "Pelayanan prima dari staf rumah makan Padang Gadang Barubah",
      caption: "Pelayanan Tulus dari Hati"
    },
    {
      src: image4,
      alt: "Pengalaman bersantap nasi padang bersama keluarga",
      caption: "Momen Berkualitas Bersama Orang Terkasih"
    },
    {
      src: image5,
      alt: "Hidangan tradisional Padang dengan sentuhan modern",
      caption: "Tradisi Kuliner Minang yang Diwariskan Turun Temurun"
    },
    {
      src: image6,
      alt: "Detail masakan Padang dengan plating yang sempurna",
      caption: "Keahlian Kuliner Padang yang Sempurna"
    },
    {
      src: image7,
      alt: "Proses memasak rendang dan gulai dengan keahlian tinggi",
      caption: "Passion dan Dedikasi dalam Setiap Sajian"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="home" />
      
      {/* Sticky Navigation */}
      <StickyNav />
      
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
      
      {/* Logo at top */}
      <div className="text-center pt-8 pb-4">
        <Logo />
      </div>
      
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with CTA */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-primary mb-6 tracking-wide">
                Selamat Datang di Gadang Barubah
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rumah Makan Padang dengan Cita Rasa Autentik Minangkabau
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              
              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium shadow-md hover:shadow-lg"
                  data-testid="button-hero-menu"
                >
                  <a 
                    href={menuPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Lihat Menu
                  </a>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base font-medium border-2"
                  data-testid="button-hero-order"
                >
                  <a
                    href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah!%20Saya%20ingin%20memesan%20makanan."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Pesan Sekarang
                  </a>
                </Button>
                
                <Button
                  onClick={() => navigate('/member/login')}
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-base font-medium border border-border/50"
                  data-testid="button-hero-member"
                >
                  <User className="mr-2 h-5 w-5" />
                  Daftar Member
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats/Trust Section */}
          <div className="mb-12">
            <Card className="border-border/30 shadow-sm bg-gradient-to-br from-background to-muted/10">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Member Setia</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Menu Masakan</div>
                  </div>
                  <div>
                    <div className="flex justify-center items-center mb-2">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Rating Pelanggan</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Services Grid Section */}
          <div id="services-section" className="mb-16 scroll-mt-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
                Layanan Eksklusif Kami
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Jelajahi berbagai layanan premium yang kami tawarkan untuk pengalaman kuliner yang sempurna
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service) => {
                const IconComponent = service.icon;
                
                return (
                  <Card 
                    key={service.id} 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-border/30 hover:border-primary/30 bg-gradient-to-br from-background to-muted/10 hover-elevate"
                    onClick={() => handleServiceClick(service)}
                    data-testid={`card-service-${service.id}`}
                  >
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-start space-x-4 sm:space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                            <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                            {service.name}
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                            {service.description}
                          </p>
                          <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                            <span>Lihat Detail</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Restaurant Images Slideshow */}
          <div className="mb-10">
            <ImageSlideshow images={slideshowImages} interval={5000} />
          </div>
          
          {/* About Us Story Section */}
          <div className="mb-10 space-y-16">
            {/* Story Header */}
            <div className="text-center">
              <h2 className="text-4xl font-serif font-medium text-foreground mb-4">Tentang Kami – Gadang Barubah</h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                Rumah makan Padang yang menghadirkan nasi padang autentik dan masakan Minang tradisional. Pilihan untuk pecinta kuliner Padang dengan cita rasa istimewa dan pelayanan di seluruh Indonesia.
              </p>
            </div>

            {/* Story Section 1 - Heritage & Innovation */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Semangat Besar untuk Berinovasi</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Gadang Barubah adalah pilihan terdepan untuk pecinta kuliner Padang di Indonesia. Nama "Gadang Barubah" melambangkan semangat besar untuk terus berinovasi, tanpa meninggalkan akar tradisi yang kaya. 
                    Di sini, setiap sajian nasi padang dan masakan Minang bukan sekadar makanan, melainkan sebuah perjalanan rasa yang menghadirkan resep turun-temurun khas Padang dengan standar kualitas tertinggi.
                  </p>
                  <p>
                    Dari rendang daging yang mendunia, gulai kambing penuh rempah, hingga aneka lauk pauk segar khas Padang—disajikan dengan sentuhan kekinian yang 
                    menggugah selera. Harmoni tradisi dan inovasi hadir dalam setiap hidangan nasi padang, membawa cita rasa autentik masakan Minang yang tak lekang oleh waktu.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <div className="aspect-[4/3]">
                  <img 
                    src={restaurantExterior} 
                    alt="Eksterior mewah rumah makan Padang Gadang Barubah Indonesia (gadangbarubahindonesia.id)" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="480"
                    data-testid="img-exterior"
                  />
                </div>
              </div>
            </div>

            {/* Story Section 2 - Philosophy & Experience */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Bahasa Universal yang Menyatukan</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Kami percaya, kuliner adalah bahasa universal yang mampu menyatukan. Karena itu, Gadang Barubah (gadangbarubahindonesia.id) berkomitmen 
                    menghadirkan pengalaman bersantap yang hangat, ramah, dan berkesan, baik untuk keluarga, sahabat, maupun kolega.
                  </p>
                  <p>
                    Biarkan aroma rempah rendang dan gulai serta cita rasa autentik nasi padang membawa Anda seolah berkunjung langsung ke ranah Minang, sekaligus 
                    merasakan kenyamanan ruang modern yang kami hadirkan di tengah Cikarang. Setiap momen makan bersama menjadi istimewa dalam suasana 
                    rumah makan Padang yang dirancang khusus untuk menciptakan kebersamaan.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="aspect-[4/3]">
                  <img 
                    src={restaurantNight} 
                    alt="Suasana malam hangat di rumah makan Padang Gadang Barubah dengan pencahayaan ambient" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="480"
                    data-testid="img-night"
                  />
                </div>
              </div>
            </div>

            {/* Story Conclusion */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-3xl font-serif font-medium text-foreground mb-6">Destinasi Kuliner Warisan Indonesia</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Gadang Barubah bukan hanya tempat makan, melainkan sebuah destinasi kuliner yang mengajak Anda menjelajahi 
                    kekayaan warisan Indonesia. Setiap hidangan menceritakan kisah budaya yang terjaga, dengan rasa yang autentik 
                    dan pelayanan yang penuh kehangatan.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Di tengah hiruk pikuk kehidupan modern, kami hadirkan ruang di mana tradisi bertemu dengan kenyamanan. 
                    Tempat di mana setiap gigitan membawa kenangan, dan setiap kunjungan menjadi bagian dari perjalanan 
                    kuliner yang tak terlupakan bersama keluarga dan orang tersayang.
                  </p>
                  <div className="pt-4">
                    <div className="inline-block w-16 h-px bg-primary"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Menu Section */}
          <div id="menu-section" className="mb-10 scroll-mt-24">
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-foreground mb-6">Menu Lengkap Kami</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Jelajahi koleksi lengkap hidangan autentik Padang kami. Lihat menu digital untuk melihat 
                    semua pilihan masakan Minang tradisional dengan harga terbaru.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="text-base font-medium"
                      data-testid="button-view-menu"
                    >
                      <a 
                        href={menuPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="link-view-menu"
                      >
                        <Eye className="mr-2 h-5 w-5" />
                        Lihat Menu
                      </a>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground/80">
                    File PDF • Update September 2025 • Kompatibel dengan semua perangkat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Catering & Takeaway Section */}
          <div id="catering-section" className="mb-10 scroll-mt-24">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-serif font-medium text-foreground mb-4">Layanan Catering & Takeaway</h3>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Pesan sekarang dan nikmati kelezatan masakan Padang favorit langsung di lokasi Anda
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Nasi Tumpeng */}
              <Card className="overflow-hidden border-border/30 shadow-sm bg-gradient-to-br from-background to-muted/5 hover-elevate hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Image Section */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <img 
                        src={nasiTumpengImage} 
                        alt="Nasi Tumpeng Gadang Barubah - paket lengkap untuk 10-15 porsi dengan lauk tradisional Minang" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="128"
                        height="128"
                        data-testid="img-nasi-tumpeng"
                      />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1 sm:mb-2">
                            <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
                            <h4 className="font-serif text-base sm:text-lg font-medium text-foreground">
                              Nasi Tumpeng
                            </h4>
                            <div className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              10-15 Porsi
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                            Paket lengkap dengan nasi putih, ayam pop, ayam gulai, rendang, dendeng batokok
                          </p>
                          <div className="text-base sm:text-lg font-bold text-primary">
                            Rp 1.500.000
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="ml-3 sm:ml-4 text-xs sm:text-sm"
                          asChild
                          data-testid="button-order-tumpeng"
                        >
                          <a
                            href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20memesan%20Nasi%20Tumpeng"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="link-order-tumpeng"
                          >
                            Order
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Nasi Box */}
              <Card className="overflow-hidden border-border/30 shadow-sm bg-gradient-to-br from-background to-muted/5 hover-elevate hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Image Section */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <img 
                        src={nasiBoxImage} 
                        alt="Saji Gadang Menu Nasi Box - berbagai pilihan menu praktis dengan harga mulai 40-46 ribu" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="128"
                        height="128"
                        data-testid="img-nasi-box"
                      />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1 sm:mb-2">
                            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
                            <h4 className="font-serif text-base sm:text-lg font-medium text-foreground">
                              Saji Gadang Menu
                            </h4>
                            <div className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              Per Box
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                            Nasi box praktis dengan pilihan lauk ayam, rendang, gulai cincang, dendeng lombok
                          </p>
                          <div className="text-base sm:text-lg font-bold text-primary">
                            Rp 40.000 - 46.000
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="ml-3 sm:ml-4 text-xs sm:text-sm"
                          asChild
                          data-testid="button-order-nasibox"
                        >
                          <a
                            href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20memesan%20Saji%20Gadang%20Menu%20(Nasi%20Box)"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="link-order-nasibox"
                          >
                            Order
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Rendang Kiloan */}
              <Card className="overflow-hidden border-border/30 shadow-sm bg-gradient-to-br from-background to-muted/5 hover-elevate hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Image Section */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <img 
                        src={rendangKiloanImage} 
                        alt="Rendang Kiloan Gadang Barubah - rendang autentik Padang dalam kemasan praktis" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width="128"
                        height="128"
                        data-testid="img-rendang-kiloan"
                      />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1 sm:mb-2">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
                            <h4 className="font-serif text-base sm:text-lg font-medium text-foreground">
                              Rendang Kiloan
                            </h4>
                            <div className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              Per Kg
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2 sm:mb-3">
                            Rendang berkualitas dalam kemasan praktis untuk keluarga dan oleh-oleh
                          </p>
                          <div className="text-xs text-primary/70 font-medium">
                            ✨ Rasa otentik • Kemasan berkualitas • Tahan lama
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="ml-3 sm:ml-4 text-xs sm:text-sm"
                          asChild
                          data-testid="button-order-rendang"
                        >
                          <a
                            href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20Rendang%20Kiloan"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="link-order-rendang"
                          >
                            Order
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Membership Benefits Section */}
          <div id="membership-section" className="mb-10 scroll-mt-24">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-serif font-medium text-foreground mb-4">Keuntungan Jadi Member</h3>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Nikmati berbagai keuntungan eksklusif dan reward points setiap kali Anda makan di Gadang Barubah
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {/* Benefit 1 */}
              <Card className="border-border/30 shadow-sm hover-elevate transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Poin Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan poin setiap transaksi dan tukar dengan voucher makan gratis
                  </p>
                </CardContent>
              </Card>
              
              {/* Benefit 2 */}
              <Card className="border-border/30 shadow-sm hover-elevate transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Promo Eksklusif</h4>
                  <p className="text-sm text-muted-foreground">
                    Akses promo dan diskon khusus member yang tidak tersedia untuk umum
                  </p>
                </CardContent>
              </Card>
              
              {/* Benefit 3 */}
              <Card className="border-border/30 shadow-sm hover-elevate transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <UsersIcon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Prioritas Layanan</h4>
                  <p className="text-sm text-muted-foreground">
                    Nikmati layanan prioritas dan proses pesanan yang lebih cepat
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/member/login')}
                size="lg"
                className="w-full sm:w-auto text-base font-medium"
                data-testid="button-membership-join"
              >
                <User className="mr-2 h-5 w-5" />
                Daftar Jadi Member
              </Button>
              
              <Button
                onClick={() => navigate('/member/login')}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base font-medium"
                data-testid="button-membership-login"
              >
                Login Member
              </Button>
            </div>
          </div>
          
          {/* Animated Uni Mascot with Speech Bubble */}
          <AnimatedUni />
          
          {/* Contact Section */}
          <div id="contact-section" className="mt-12 scroll-mt-24">
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-2xl font-serif font-medium text-foreground mb-4">Hubungi Kami</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ada pertanyaan atau ingin melakukan pemesanan? Hubungi kami sekarang!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                    <Button
                      asChild
                      size="lg"
                      className="w-full sm:w-auto text-base font-medium bg-[#25D366] hover:bg-[#20BA5A] text-white"
                      data-testid="button-contact-whatsapp"
                    >
                      <a
                        href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah!%20Saya%20ingin%20bertanya."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat via WhatsApp
                      </a>
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    WhatsApp: +62 895-0976-6739
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-xs text-muted-foreground/80">
              Keunggulan Kuliner yang Tak Tertandingi
            </p>
          </div>
        </div>
      </footer>

      {/* Promotional Popup */}
      <PromotionalPopup 
        isVisible={showPromoPopup} 
        onClose={handleClosePopup}
      />
    </div>
  );
}