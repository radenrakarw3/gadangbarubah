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
    <header className="bg-background/98 backdrop-blur-sm border-b border-border/20 py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300" data-testid="header-section">
      <div className="max-w-6xl mx-auto flex items-center justify-between min-h-[60px]">
        {/* Back Button */}
        <div className="w-20 flex justify-start">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-sm">Kembali</span>
            </Button>
          )}
        </div>
        
        {/* Logo - Scaled but still prominent */}
        <div className="flex-1 flex justify-center">
          <div className="transform scale-75 sm:scale-90 transition-transform duration-300">
            <Logo />
          </div>
        </div>
        
        {/* Spacer for balance */}
        <div className="w-20"></div>
      </div>
    </header>
  );
}