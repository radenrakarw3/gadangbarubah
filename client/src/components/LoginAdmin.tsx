import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const ADMIN_PIN = '181818';

interface LoginAdminProps {
  onLogin: () => void;
}

export default function LoginAdmin({ onLogin }: LoginAdminProps) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin !== ADMIN_PIN) {
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
      localStorage.setItem('adminAuth', 'true');
      onLogin();
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Masukkan PIN admin untuk mengakses dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Admin</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Masukkan PIN 6 digit"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                data-testid="input-admin-pin"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={pin.length !== 6 || isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}