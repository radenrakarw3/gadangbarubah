import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginAdminProps {
  onLogin: () => void;
}

export default function LoginAdmin({ onLogin }: LoginAdminProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          role: 'admin'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Handle different error types
        if (error.locked) {
          const minutes = Math.ceil(error.lockTimeRemaining / 60000);
          setErrorMessage(`Akun terkunci. Coba lagi dalam ${minutes} menit.`);
        } else if (error.attemptsRemaining !== undefined) {
          setErrorMessage(`Login gagal. ${error.attemptsRemaining} percobaan tersisa.`);
        } else {
          setErrorMessage(error.message || 'Username atau password salah');
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.user.role !== 'admin') {
        setErrorMessage('Akses ditolak. Akun ini bukan admin.');
        setIsLoading(false);
        return;
      }

      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${data.user.username}`,
      });
      
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
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
            Masukkan username dan password untuk mengakses dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" data-testid="alert-login-error">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                data-testid="input-admin-username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-testid="input-admin-password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!username || !password || isLoading}
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
