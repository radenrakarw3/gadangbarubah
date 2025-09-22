import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import Logo from './Logo';

interface HeaderProps {
  showBackButton?: boolean;
  backPath?: string;
}

export default function Header({ showBackButton = false, backPath = '/' }: HeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border/30 py-6 px-4 sticky top-0 z-50" data-testid="header-section">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Back Button */}
        <div className="w-24 flex justify-start">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          )}
        </div>
        
        {/* Logo - Always centered and consistent size */}
        <div className="flex-1 flex justify-center">
          <Logo />
        </div>
        
        {/* Spacer for balance */}
        <div className="w-24"></div>
      </div>
    </header>
  );
}