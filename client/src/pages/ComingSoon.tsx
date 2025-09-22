import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ComingSoon() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-back-home"
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

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-border/30 shadow-lg">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Clock className="h-12 w-12 text-primary" />
              </div>
              
              <h1 className="text-3xl font-serif font-medium text-foreground mb-4">
                Coming Soon
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Fitur member dashboard sedang dalam pengembangan. Nantikan update terbaru dari kami!
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/')}
                  className="w-full text-base"
                  data-testid="button-back-to-home"
                >
                  Kembali ke Beranda
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  Terima kasih atas kesabaran Anda
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}