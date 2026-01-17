
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { roomsData, gameProvidersData } from '@/lib/data';
import type { Room, GameProvider } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

const GameProvidersTable = ({ data }: { data: GameProvider[] }) => {
  const { t } = useTranslation();
  const params = useParams();
  const { id } = params;
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleProvider = (providerName: string) => {
    setExpandedProviders(prev => ({
      ...prev,
      [providerName]: !prev[providerName]
    }));
  };
  
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({});
  
  const toggleProviderStatus = (providerName: string, checked: boolean) => {
      setProviderStatus(prev => ({...prev, [providerName]: checked}));
  }

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableBody>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell className="font-medium">{t('editRoom.showHideAll')}</TableCell>
            <TableCell></TableCell>
            <TableCell className="text-right">
              <Button size="sm" className='bg-blue-600 hover:bg-blue-700'>{t('editRoom.showAll')}</Button>
            </TableCell>
          </TableRow>
          {data.map((provider) => {
            const isExpanded = expandedProviders[provider.name];
            const isOn = providerStatus[provider.name] ?? true;

            return (
              <React.Fragment key={provider.name}>
                <TableRow>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell className="text-right">{provider.value || ''}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {provider.actions.includes('Config') && <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">{t('editRoom.config')}</Button>}
                    {provider.actions.includes('Show') && (
                       <Button 
                        size="sm" 
                        className={isExpanded ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        onClick={() => toggleProvider(provider.name)}
                      >
                        {isExpanded ? t('editRoom.hide') : t('editRoom.show')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell className="pl-8">{provider.name.replace(' (prepayment)', '').toUpperCase()}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end">
                          <Switch
                            checked={isOn}
                            onCheckedChange={(checked) => toggleProviderStatus(provider.name, checked)}
                          />
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Link href={`/my-rooms/${id}/games/${encodeURIComponent(provider.name)}`}>
                          {t('editRoom.games')}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};


export default function EditRoomGamesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const foundRoom = roomsData.find(r => r.id.toString() === id);
    if (foundRoom) {
      setRoom(foundRoom);
    } else {
        toast({
            title: "Error",
            description: "Room not found",
            variant: "destructive"
        })
        router.push('/my-rooms');
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, router, toast]);


  if (loading || !room) {
      return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/my-rooms" className="hover:underline">{t('myRooms.breadcrumb')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                 <ChevronRight className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                   <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
        </main>
      );
  }

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/my-rooms" className="hover:underline">{t('myRooms.breadcrumb')}</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/my-rooms/${id}/edit`} className="hover:underline">{room.login}</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{t('editRoom.games')}</span>
      </div>
      <Card className="max-w-4xl mx-auto">
          <CardHeader>
              <CardTitle>{`[${room.login}] ${t('editRoom.editGames')}`}</CardTitle>
          </CardHeader>
          <CardContent>
             <GameProvidersTable data={gameProvidersData} />
          </CardContent>
      </Card>
    </main>
  );
}
