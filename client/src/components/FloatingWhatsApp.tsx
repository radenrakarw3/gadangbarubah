import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const whatsappNumber = '6289509766739';
  const defaultMessage = 'Halo Gadang Barubah! Saya ingin bertanya.';
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Button
      asChild
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 z-40 transition-all duration-300 hover:scale-110"
      data-testid="button-floating-whatsapp"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        data-testid="link-floating-whatsapp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </Button>
  );
}
