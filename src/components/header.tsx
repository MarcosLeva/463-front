
'use client';

import { Globe, Laptop, PanelLeft, UserCog, UserPlus, BarChartHorizontal, PieChart, History, Shuffle, ChevronsLeft, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  Landmark,
  Terminal,
  AlertTriangle,
  LogOut,
  Home,
  FilePen,
  Repeat,
  Wallet
} from 'lucide-react';
import { CreateTerminalDialog } from './dashboard/create-terminal-dialog';
import { useAuthStore } from '@/store/auth';
import { CreateUserDialog } from './dashboard/create-user-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';
import { Input } from './ui/input';
import { useTranslation } from 'react-i18next';


interface HeaderProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Header({ isSidebarCollapsed, toggleSidebar }: HeaderProps) {
  const { t } = useTranslation();
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { email } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuthStore();

  const navItems = [
      { href: '/dashboard', icon: Home, label: t('sidebar.users') },
      { href: '/profile/edit', icon: FilePen, label: t('sidebar.editProfile'), id: 'edit-profile' },
      { href: '/balance-history', icon: Repeat, label: t('sidebar.latestTransactions') },
      { href: '#', icon: UserPlus, label: t('sidebar.createUser'), id: 'create-user' },
      { href: '/provider-statistics', icon: BarChartHorizontal, label: t('sidebar.providerStats') },
      { href: '/statistics', icon: PieChart, label: t('sidebar.stats') },
      { href: '/profile/edit?tab=game_settings', icon: Wallet, label: t('sidebar.gameSettings'), id: 'game-settings' },
      { href: '/changes', icon: History, label: t('sidebar.changes') },
      { href: '/intersection-ip', icon: Shuffle, label: t('sidebar.intersectionIp') },
  ];

  const handleLinkClick = (id?: string) => {
    if (id === 'create-user') {
      setUserDialogOpen(true);
    }
    setSheetOpen(false);
  };
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  const isActive = (href: string, id?: string) => {
    const tab = searchParams.get('tab');
    if (id === 'edit-profile') {
      return pathname === href && !tab;
    }
    if (id === 'game-settings') {
      return pathname === '/profile/edit' && tab === 'game_settings';
    }
    return pathname === href;
  }

  const NavContent = ({ onLinkClick }: { onLinkClick: (id?: string) => void }) => {
    return (
      <nav className="grid items-start gap-1 px-2 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => {
              if (item.id === 'create-user') {
                e.preventDefault();
                onLinkClick(item.id);
              }
            }}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-primary',
              isActive(item.href, item.id) && 'bg-sidebar-accent text-sidebar-primary',
              'cursor-pointer text-xs'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <>
      <CreateUserDialog isOpen={isUserDialogOpen} onClose={() => setUserDialogOpen(false)} />
       <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-header px-4 sm:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="relative text-foreground hover:bg-foreground/10 hover:text-foreground"
            >
               {isSidebarCollapsed ? (
                 <Menu className="h-6 w-6" />
                
              ) : (
                <X className="h-6 w-6" />
              )}
              <span className="sr-only">{t('header.toggleSidebar')}</span>
            </Button>
            <Link href="/dashboard" className="hidden sm:block">
              <Image src="/logo.png" alt="463 Logo" width={150} height={37} />
            </Link>
          </div>

          <div className="sm:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="bg-transparent border-0 hover:bg-foreground/10">
                  <Menu className="h-6 w-6 text-foreground" />
                  <span className="sr-only">{t('header.toggleMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs bg-sidebar p-0 flex flex-col">
                <div className="flex h-16 items-center justify-center border-b px-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Image src="/logo.png" alt="463 Logo" width={150} height={37} />
                  </Link>
                </div>
                <div className="py-4 space-y-4 flex-1 flex flex-col">
                  <div className="relative px-4">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('header.searchPlaceholder')} className="bg-input pl-8" />
                  </div>
                  <NavContent onLinkClick={handleLinkClick} />
                  <div className="mt-auto p-2 border-t">
                    <div className="flex items-center justify-between">
                      <nav className="grid items-start gap-1 px-2 text-sm font-medium">
                          <a
                              href={'/login'}
                              onClick={handleLogout}
                              className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-primary',
                                  'cursor-pointer text-xs'
                              )}
                          >
                              <LogOut className="h-4 w-4" />
                              {t('header.logout')}
                          </a>
                      </nav>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
            
          <div className='sm:hidden'>
              <Image 
                src="/logo.png" 
                alt="463 Logo" 
                width={120} 
                height={30}
              />
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-foreground/10">
              <Laptop className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-500 hover:bg-foreground/10">
              <Globe className="h-5 w-5" />
            </Button>
            <div className="text-sm text-foreground/80 flex items-center gap-2">
              <span>{email}</span>
              <span className="text-muted-foreground">|</span>
              <span>207000145.00</span>
            </div>
            <Select defaultValue="UYU">
              <SelectTrigger className="w-[80px] bg-background/20 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UYU">UYU</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </header>
    </>
  );
}
