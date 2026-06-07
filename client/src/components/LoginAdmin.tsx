import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSiteLanguage } from '@/lib/language';
import {
  ADMIN_PORTAL_CONFIG,
  roleAllowedForPortal,
  type AdminPortal,
} from '@shared/admin-portals';
import type { AdminRole } from '@shared/schema';

interface LoginAdminProps {
  portal: AdminPortal;
  onLogin: () => void;
}

export default function LoginAdmin({ portal, onLogin }: LoginAdminProps) {
  const { lang } = useSiteLanguage();
  const portalConfig = ADMIN_PORTAL_CONFIG[portal];
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
          portal,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.locked) {
          const minutes = Math.ceil(data.lockTimeRemaining / 60000);
          setErrorMessage(`Akun terkunci. Coba lagi dalam ${minutes} menit.`);
        } else if (data.attemptsRemaining !== undefined) {
          setErrorMessage(`Login gagal. ${data.attemptsRemaining} percobaan tersisa.`);
        } else {
          setErrorMessage(data.message || 'Username atau password salah');
        }
        setIsLoading(false);
        return;
      }

      const role = data.user?.role as AdminRole | undefined;
      if (!role || !roleAllowedForPortal(role, portal)) {
        setErrorMessage(
          lang === 'ID'
            ? 'Akses ditolak. Akun tidak sesuai dengan portal admin ini.'
            : 'Access denied. This account cannot sign in to this admin portal.',
        );
        setIsLoading(false);
        return;
      }

      toast({
        title: lang === 'ID' ? "Login berhasil" : "Login successful",
        description: lang === 'ID' ? `Selamat datang, ${data.user.username}` : `Welcome, ${data.user.username}`,
      });
      
      setIsLoading(false);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const portalTitle = lang === 'ID' ? portalConfig.labelID : portalConfig.labelEN;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{portalTitle}</CardTitle>
          <CardDescription>
            {lang === 'ID'
              ? `Masuk ke panel ${portalConfig.labelID} dengan username dan password cabang`
              : `Sign in to the ${portalConfig.labelEN} panel with your branch credentials`}
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
              <Label htmlFor="username">{lang === 'ID' ? 'Username' : 'Username'}</Label>
              <Input
                id="username"
                type="text"
                placeholder={lang === 'ID' ? 'Masukkan username' : 'Enter username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                data-testid="input-admin-username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{lang === 'ID' ? 'Password' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={lang === 'ID' ? 'Masukkan password' : 'Enter password'}
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
              {isLoading
                ? (lang === 'ID' ? 'Memverifikasi...' : 'Verifying...')
                : (lang === 'ID' ? 'Masuk ke Admin' : 'Sign in as Admin')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
