
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { roomsData } from '@/lib/data';
import type { Room, GameProvider, Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/auth';


const GameItem = ({ game, isChecked, onToggle }: { game: Game, isChecked: boolean, onToggle: (checked: boolean) => void }) => {
    return (
         <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 border p-2 rounded-md bg-background">
            <span className="text-sm truncate">{game.name}</span>
            <Switch
                checked={isChecked}
                onCheckedChange={onToggle}
            />
        </div>
    );
};

const ProviderGamesList = ({ games, gameStatus, onGameStatusChange }: { games: Game[], gameStatus: Record<string, boolean>, onGameStatusChange: (gameId: string, checked: boolean) => void }) => {
    const { t } = useTranslation();

    if (!games || games.length === 0) {
        return <p className='text-center text-muted-foreground py-4'>{t('hallDetails.noData')}</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-muted/20">
            {games.map(game => (
                <GameItem
                    key={game.id}
                    game={game}
                    isChecked={gameStatus[game.id] ?? game.active}
                    onToggle={(checked) => onGameStatusChange(game.id, checked)}
                />
            ))}
        </div>
    );
}

const GameProvidersTable = ({ data, onGameStatusChange, gameStatus }: { data: GameProvider[], gameStatus: Record<string, Record<string, boolean>>, onGameStatusChange: (providerId: string, gameId: string, checked: boolean) => void }) => {
  const { t } = useTranslation();
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleProvider = (providerId: string) => {
    setExpandedProviders(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const areAllShown = data.length > 0 && data.every(p => expandedProviders[p.id]);

  const toggleAll = () => {
    const newExpandedState: Record<string, boolean> = {};
    if (!areAllShown) {
      data.forEach(p => newExpandedState[p.id] = true);
    }
    setExpandedProviders(newExpandedState);
  };
  
  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableBody>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableCell colSpan={2} className="font-medium">{t('editRoom.showHideAll')}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" className='bg-blue-600 hover:bg-blue-700' onClick={toggleAll}>
                {areAllShown ? t('editRoom.hide') : t('editRoom.showAll')}
              </Button>
            </TableCell>
          </TableRow>
          {data.map((provider) => {
            const isExpanded = expandedProviders[provider.id];

            return (
              <React.Fragment key={provider.id}>
                <TableRow>
                  <TableCell colSpan={2}>{provider.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                        size="sm" 
                        className={isExpanded ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        onClick={() => toggleProvider(provider.id)}
                      >
                        {isExpanded ? t('editRoom.hide') : t('editRoom.show')}
                      </Button>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={3} className="p-0">
                       <ProviderGamesList
                          games={provider.games}
                          gameStatus={gameStatus[provider.id] || {}}
                          onGameStatusChange={(gameId, checked) => onGameStatusChange(provider.id, gameId, checked)}
                        />
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
  const { accessToken } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [gameProviders, setGameProviders] = useState<GameProvider[]>([]);
  const [gameStatus, setGameStatus] = useState<Record<string, Record<string, boolean>>>({});

  const fetchGameProviders = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
        const response = await fetch(`https://admin-service-258390046996.us-central1.run.app/halls/games/by-provider`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error('Failed to fetch game providers');

        const data = await response.json();
        const transformedData: GameProvider[] = data.map((provider: any) => ({
            id: provider.id,
            name: provider.name,
            games: provider.games.map((game: any) => ({
                id: game.id,
                name: game.title,
                active: game.enabled,
            })),
        }));
        setGameProviders(transformedData);

    } catch (error) {
        toast({
            title: "Error",
            description: "Could not load game providers data.",
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  }, [accessToken, toast]);

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
        return;
    }
    fetchGameProviders();
  }, [id, router, toast, fetchGameProviders]);


  const handleGameStatusChange = (providerId: string, gameId: string, checked: boolean) => {
    setGameStatus(prev => ({
        ...prev,
        [providerId]: {
            ...(prev[providerId] || {}),
            [gameId]: checked
        }
    }));
  };

  const handleSave = () => {
    console.log("Saving game status changes:", gameStatus);
    toast({
        title: "Saved",
        description: "Game settings have been saved.",
    });
  }

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
             <GameProvidersTable data={gameProviders} gameStatus={gameStatus} onGameStatusChange={handleGameStatusChange} />
          </CardContent>
           <CardFooter className="mt-6 flex justify-center border-t pt-6">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">{t('editRoom.save')}</Button>
            </CardFooter>
      </Card>
    </main>
  );
}
