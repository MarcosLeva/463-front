'use client';

import React, { useState, useEffect } from 'react';
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
import { roomsData, gameProvidersData, gamesByProvider } from '@/lib/data';
import type { Room, GameProvider, Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';


const ProviderGamesTable = ({ games }: { games: Game[] }) => {
    const { t } = useTranslation();
    const [gameStatus, setGameStatus] = useState<Record<number, boolean>>(() =>
        games.reduce((acc, game) => {
            acc[game.id] = game.active;
            return acc;
        }, {} as Record<number, boolean>)
    );

    const toggleGameStatus = (gameId: number) => {
        setGameStatus(prev => ({...prev, [gameId]: !prev[gameId]}));
    }

    const GameItem = ({ game }: { game: Game }) => {
        const isOn = gameStatus[game.id];
        return (
             <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border p-2 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">{game.id}</span>
                <span className="text-sm truncate">{game.name}</span>
                <Switch 
                    checked={isOn}
                    onCheckedChange={() => toggleGameStatus(game.id)}
                />
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {games.map(game => <GameItem key={game.id} game={game} />)}
        </div>
    );
}

export default function ProviderGamesPage() {
    const { t } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { id, providerId } = params;

    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<Room | null>(null);
    const [provider, setProvider] = useState<GameProvider | null>(null);
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const foundRoom = roomsData.find(r => r.id.toString() === id);
        if (foundRoom) {
            setRoom(foundRoom);
        } else {
            toast({ title: "Error", description: "Room not found", variant: "destructive" });
            router.push('/my-rooms');
            return;
        }

        const decodedProviderName = decodeURIComponent(providerId as string);
        const foundProvider = gameProvidersData.find(p => p.name === decodedProviderName);
        if (foundProvider) {
            setProvider(foundProvider);
            // @ts-ignore
            const providerGames = gamesByProvider[foundProvider.name] || [];
            setGames(providerGames);
        } else {
             toast({ title: "Error", description: "Provider not found", variant: "destructive" });
            router.push(`/my-rooms/${id}/games`);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Shorter loading time
        return () => clearTimeout(timer);
    }, [id, providerId, router, toast]);

    const handleSave = () => {
        toast({
            title: "Saved",
            description: "Game settings have been saved.",
        });
        router.push(`/my-rooms/${id}/games`);
    }

    if (loading || !room || !provider) {
        return (
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
                    <ChevronRight className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <ChevronRight className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <ChevronRight className="h-4 w-4" />
                     <Skeleton className="h-4 w-16" />
                    <ChevronRight className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-5 w-48 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                     <CardFooter className="mt-6 flex justify-start border-t pt-6">
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
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
                <Link href={`/my-rooms/${id}/games`} className="hover:underline">{t('editRoom.games')}</Link>
                 <ChevronRight className="h-4 w-4" />
                <span>{provider.name}</span>
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>{`[${room.login}] Edit Hall :: Games`}</CardTitle>
                    <p className='text-sm text-muted-foreground pt-2'>Games Providers / {provider.name}</p>
                </CardHeader>
                <CardContent>
                    {games.length > 0 ? (
                        <ProviderGamesTable games={games} />
                    ) : (
                        <p className='text-center text-muted-foreground py-10'>{t('hallDetails.noData')}</p>
                    )}
                </CardContent>
                <CardFooter className="mt-6 flex justify-center border-t pt-6">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">{t('editRoom.save')}</Button>
                </CardFooter>
            </Card>
        </main>
    );
}
