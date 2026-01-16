

'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  PanelLeft,
  Landmark,
  Terminal,
  AlertTriangle,
  LogOut,
  UserCog,
  UserPlus,
  BarChartHorizontal,
  PieChart,
  History,
  Shuffle,
  Home,
  FilePen,
  Repeat,
  Wallet,
  ChevronsLeft,
  Menu,
  X,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { CreateTerminalDialog } from './dashboard/create-terminal-dialog';
import { useAuthStore } from '@/store/auth';
import { CreateUserDialog } from './dashboard/create-user-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from 'react-i18next';


const LogoutNavContent = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const router = useRouter();
    const { logout } = useAuthStore();
    const { t } = useTranslation();

    const handleLogout = (e: React.MouseEvent) => {
      e.preventDefault();
      logout();
      router.push('/login');
    };

    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
             <a
                href={'/login'}
                onClick={handleLogout}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-primary',
                    isCollapsed && 'justify-center',
                    'cursor-pointer text-xs'
                )}
            >
                <LogOut className="h-4 w-4" />
                <span className={cn('overflow-hidden transition-all', isCollapsed ? 'w-0' : 'w-auto')}>{t('header.logout')}</span>
            </a>
          </TooltipTrigger>
           {isCollapsed && (
            <TooltipContent side="right">
              {t('header.logout')}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
}

export function Sidebar({ isCollapsed }: { isCollapsed: boolean; }) {
  const { t } = useTranslation();
  const [isTerminalDialogOpen, setTerminalDialogOpen] = useState(false);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('sidebar.users') },
    { href: '/my-rooms', icon: Building, label: t('sidebar.myRooms') },
    { href: '/profile/edit', icon: FilePen, label: t('sidebar.editProfile'), id: 'edit-profile' },
    { href: '/balance-history', icon: Repeat, label: t('sidebar.latestTransactions') },
    { href: '#', icon: UserPlus, label: t('sidebar.createUser'), id: 'create-user' },
    { href: '/provider-statistics', icon: BarChartHorizontal, label: t('sidebar.providerStats') },
    { href: '/statistics', icon: PieChart, label: t('sidebar.stats') },
    { href: '/profile/edit?tab=game_settings', icon: Wallet, label: t('sidebar.gameSettings'), id: 'game-settings' },
    { href: '/changes', icon: History, label: t('sidebar.changes') },
    { href: '/intersection-ip', icon: Shuffle, label: t('sidebar.intersectionIp') },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'dd.MM.yyyy HH:mm:ss', { locale: es }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLinkClick = (id?: string) => {
    if (id === 'create-terminal') {
      setTerminalDialogOpen(true);
    }
    if (id === 'create-user') {
      setUserDialogOpen(true);
    }
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

  return (
    <>
      <CreateTerminalDialog isOpen={isTerminalDialogOpen} onClose={() => setTerminalDialogOpen(false)} />
      <CreateUserDialog isOpen={isUserDialogOpen} onClose={() => setUserDialogOpen(false)} />
      <aside className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-sidebar sm:flex transition-all duration-300 top-16",
        isCollapsed ? "w-20" : "w-64"
        )}>

        {!isCollapsed && (
          <div className="p-4 space-y-2">
              <p className="text-center text-xs text-muted-foreground">{currentTime}</p>
              <div>
                <Input placeholder={t('sidebar.searchPlaceholder')} className="bg-input"/>
              </div>
          </div>
        )}

        <div className="flex flex-1 flex-col justify-start py-2 overflow-y-auto">
          <TooltipProvider>
            <nav className="flex flex-col items-stretch gap-1 px-2 text-sm font-medium">
              {navItems.map((item) => (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          if (item.id === 'create-user') {
                            e.preventDefault();
                            handleLinkClick(item.id);
                          }
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-primary',
                          isActive(item.href, item.id) && 'bg-sidebar-accent text-sidebar-primary',
                          isCollapsed && 'justify-center',
                          'cursor-pointer text-xs'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className={cn('overflow-hidden transition-all', isCollapsed ? 'w-0' : 'w-auto')}>{item.label}</span>
                      </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>

         <div className="mt-auto p-2 border-t">
            <div className={cn("flex items-center", isCollapsed ? 'flex-col gap-2' : 'justify-between' )}>
                <LogoutNavContent isCollapsed={isCollapsed}/>
                <ThemeToggle />
            </div>
         </div>
      </aside>
    </>
  );
}
