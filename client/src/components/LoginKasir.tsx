import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calculator } from 'lucide-react';

const KASIR_PIN = '818181';

interface LoginKasirProps {
  onLogin: () => void;
}

export default function LoginKasir({ onLogin }: LoginKasirProps) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin !== KASIR_PIN) {
      toast({
        title: "PIN salah",
        description: "PIN yang dimasukkan tidak benar",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      localStorage.setItem('kasirAuth', 'true');
      onLogin();
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-900 to-yellow-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Kasir Login</CardTitle>
          <CardDescription>
            Masukkan PIN kasir untuk mengakses sistem bill
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Kasir</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Masukkan PIN 6 digit"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                data-testid="input-kasir-pin"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={pin.length !== 6 || isLoading}
              data-testid="button-kasir-login"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Kasir'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}