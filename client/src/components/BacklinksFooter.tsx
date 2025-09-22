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
                href="https://maps.google.com/?q=Restoran+Gadang+Barubah+Padang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-google-maps"
              >
                <MapPin className="w-5 h-5 mt-0.5 text-gold flex-shrink-0" />
                <span className="group-hover:underline">
                  Jl. Veteran No. 123<br />
                  Padang, Sumatera Barat<br />
                  Indonesia 25111
                </span>
              </a>
              
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Gadang%20Barubah,%20saya%20ingin%20bertanya%20tentang%20menu%20dan%20reservasi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-gold transition-colors group"
                data-testid="link-whatsapp-footer"
              >
                <Phone className="w-5 h-5 text-gold" />
                <span className="group-hover:underline">+62 812-3456-7890</span>
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
                href="https://www.google.com/maps/place/Gadang+Barubah+Restaurant" 
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
                href="https://gofood.link/a/gadangbarubah" 
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
                href="#menu-signature" 
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-signature"
              >
                Menu Signature Minang
              </a>
              
              <a 
                href="#menu-nasi-padang" 
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-nasi-padang"
              >
                Nasi Padang Tradisional
              </a>
              
              <a 
                href="#menu-dessert" 
                className="block text-cream/80 hover:text-gold transition-colors hover:underline"
                data-testid="link-menu-dessert"
              >
                Dessert & Klepon
              </a>
              
              <a 
                href="#catering" 
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
            © 2024 Gadang Barubah Restaurant. Restoran Padang Terbaik di Sumatera Barat
          </p>
          
          {/* SEO Internal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="#tentang-kami" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-about">
              Tentang Gadang Barubah
            </a>
            <span className="text-cream/40">|</span>
            <a href="#menu-lengkap" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-full-menu">
              Menu Lengkap
            </a>
            <span className="text-cream/40">|</span>
            <a href="#reservasi" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-reservation">
              Reservasi Meja
            </a>
            <span className="text-cream/40">|</span>
            <a href="#kontak" className="text-cream/60 hover:text-gold transition-colors" data-testid="link-contact">
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