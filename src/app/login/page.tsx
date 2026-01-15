
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { User, Lock } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@463.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.errorDescription'),
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      const { access_token, user } = data;
      login(user, access_token);
      
      toast({
        title: t('login.successTitle'),
        description: t('login.successDescription', { name: user.fullName || user.username }),
      });
      router.push('/dashboard');

    } catch (error: any) {
      toast({
        title: t('login.errorTitle'),
        description: error.message || t('login.errorApi'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen login-gradient">
      <main className="flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-sm mx-4 relative">
          <div className='absolute top-4 right-4'>
            <ThemeToggle />
          </div>
          <CardHeader className="items-center pt-8 pb-4">
            <Image src="/logo.png" alt="463 Logo" width={150} height={37} className="mb-4" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {t('login.userLabel')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                   <Lock className="h-4 w-4 text-muted-foreground" />
                  {t('login.passwordLabel')}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  disabled={isLoading}
                />
              </div>
               <div className="flex items-center">
                 <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-primary hover:underline"
                  >
                    {t('login.recoverPassword')}
                  </Link>
               </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('login.loggingIn') : t('login.loginButton')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
          </CardFooter>
        </Card>
      </main>

      <footer className="w-full p-4 text-center text-xs text-white/70">
        {t('login.footer')}
      </footer>
    </div>
  );
}
