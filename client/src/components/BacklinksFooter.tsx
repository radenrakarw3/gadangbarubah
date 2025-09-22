import { MapPin, Phone, Instagram, Facebook, Clock } from "lucide-react";

export function BacklinksFooter() {
  return (
    <footer className="bg-[#3f1113] text-cream border-t border-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Lokasi & Kontak */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold mb-4">Lokasi & Kontak</h3>
            <div className="space-y-3">
              <a 
                href="https://maps.app.goo.gl/JcR1hDXTawCkjGu7A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-google-maps"
              >
                <MapPin className="w-5 h-5 mt-0.5 text-gold flex-shrink-0" />
                <span className="group-hover:underline">
                  Main Gate, Mall Cikarang<br />
                  Jl. Raya Cikarang - Cibarusah, Pasirsari<br />
                  Cikarang Sel., Kabupaten Bekasi<br />
                  Jawa Barat 17530<br />
                  Pollux, Lantai GF
                </span>
              </a>
              
              <a 
                href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20menu%20dan%20reservasi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-whatsapp-footer"
              >
                <Phone className="w-5 h-5 text-gold" />
                <span className="group-hover:underline">089509766739</span>
              </a>
              
              <div className="flex items-center gap-3 text-cream/80">
                <Clock className="w-5 h-5 text-gold" />
                <span>Buka Setiap Hari: 10:00 - 22:00 WIB</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold mb-4">Ikuti Kami</h3>
            <div className="space-y-3">
              <a 
                href="https://instagram.com/gadangbarubah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5 text-gold" />
                <span className="group-hover:underline">@gadangbarubah</span>
              </a>
              
              <a 
                href="https://facebook.com/gadangbarubah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5 text-gold" />
                <span className="group-hover:underline">Gadang Barubah Restaurant</span>
              </a>
              
              <a 
                href="https://maps.app.goo.gl/JcR1hDXTawCkjGu7A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-google-business"
              >
                <MapPin className="w-5 h-5 text-gold" />
                <span className="group-hover:underline">Review di Google Maps</span>
              </a>
            </div>
          </div>

          {/* Platform Delivery */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold mb-4">Pesan Online</h3>
            <div className="space-y-3">
              <a 
                href="https://gofood.co.id/en/jakarta/restaurant/gadang-barubah-0879bb59-cabc-41e7-9d69-d80029a0a48c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-gofood"
              >
                <div className="w-5 h-5 bg-gold rounded flex-shrink-0"></div>
                <span className="group-hover:underline">Pesan di GoFood</span>
              </a>
              
              <a 
                href="https://grabfood.page.link/gadangbarubah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-grabfood"
              >
                <div className="w-5 h-5 bg-gold rounded flex-shrink-0"></div>
                <span className="group-hover:underline">Pesan di GrabFood</span>
              </a>
              
              <a 
                href="https://shopee.food/gadangbarubah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-shopeefood"
              >
                <div className="w-5 h-5 bg-gold rounded flex-shrink-0"></div>
                <span className="group-hover:underline">Pesan di ShopeeFood</span>
              </a>
            </div>
          </div>

          {/* Menu Navigasi */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold mb-4">Menu Kami</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20menu%20signature%20Minang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-signature"
              >
                Menu Signature Minang
              </a>
              
              <a 
                href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20nasi%20padang%20tradisional" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-nasi-padang"
              >
                Nasi Padang Tradisional
              </a>
              
              <a 
                href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20dessert%20dan%20klepon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-dessert"
              >
                Dessert & Klepon
              </a>
              
              <a 
                href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20layanan%20catering" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-catering"
              >
                Layanan Catering
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & SEO Links */}
        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-cream/60 text-sm mb-4">
            © 2025 Gadang Barubah
          </p>
          
          {/* SEO Internal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20restoran" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-about">
              Tentang Gadang Barubah
            </a>
            <span className="text-cream/40">|</span>
            <a href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20melihat%20menu%20lengkap" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-full-menu">
              Menu Lengkap
            </a>
            <span className="text-cream/40">|</span>
            <a href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20reservasi%20meja" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-reservation">
              Reservasi Meja
            </a>
            <span className="text-cream/40">|</span>
            <a href="https://wa.me/6289509766739?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-contact">
              Hubungi Kami
            </a>
          </div>
          
          {/* Keywords untuk SEO */}
          <div className="mt-4 text-xs text-cream/40">
            <p>Restoran Padang • Masakan Minang • Nasi Padang • Rendang • Sate Padang • Catering Padang • Gadang Barubah</p>
          </div>
        </div>
      </div>
    </footer>
  );
}