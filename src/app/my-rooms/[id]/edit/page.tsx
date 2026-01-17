
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Home, ChevronRight, RefreshCw, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import type { Room } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';

const FormRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-3 items-center gap-4 border-b py-3 px-6">
        <Label className="text-right text-sm">{label}</Label>
        <div className="col-span-2">{children}</div>
    </div>
);

const ReadOnlyRow = ({ label, value }: { label: string; value: string | number }) => (
    <FormRow label={label}>
        <p className="text-sm font-medium">{value}</p>
    </FormRow>
);


export default function EditRoomPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const { accessToken } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    active: false,
    demoBalance: '100000.00',
    egtJackpots: false,
    rtp: '92',
    minTotalBet: '0.01',
    maxTotalBet: '30.00',
    sportMinBet: '0.00',
    sportMaxBet: '0.00',
    ratio: '3x4',
    hallKey: '9jSCHtXwSs'
  });

  const fetchRoom = useCallback(async () => {
    if (!id || !accessToken) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/halls/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch room data');
        }

        const data = await response.json();
        
        const roomData: Room = {
            id: data.id,
            login: data.name,
            active: data.status === 'ACTIVE',
            currency: data.currency,
            balance: parseFloat(data.balance),
            rtp: data.rtpBps / 100,
            totalBet: 0, // Not available from this endpoint
            totalWin: 0, // Not available
            profit: 0, // Not available
            terminals: data.hallGames?.length || 0,
        };

        setRoom(roomData);
        setFormData(prev => ({
            ...prev,
            active: roomData.active,
            rtp: String(roomData.rtp),
        }));

    } catch (error) {
        toast({
            title: "Error",
            description: "Could not load room data.",
            variant: 'destructive',
        });
        router.push('/my-rooms');
    } finally {
        setLoading(false);
    }
  }, [id, accessToken, router, toast]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  }

  const handleSelectChange = (id: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    toast({
        title: "Room Saved",
        description: `Changes to room ${room?.login} have been saved.`
    })
  }
  
  const handleCopyKey = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(formData.hallKey).then(() => {
            toast({
                title: t('editRoom.hallKeyCopied.title'),
                description: t('editRoom.hallKeyCopied.description'),
            });
        });
    }
  };

  const generateRandomKey = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleRefreshKey = () => {
    const newKey = generateRandomKey();
    setFormData(prev => ({ ...prev, hallKey: newKey }));
    toast({
        title: t('editRoom.newHallKey.title'),
        description: t('editRoom.newHallKey.description'),
    });
  };

  if (loading || !room) {
      return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/my-rooms" className="hover:underline">{t('myRooms.breadcrumb')}</Link>
                <ChevronRight className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({length: 10}).map((_, i) => (
                             <div key={i} className="grid grid-cols-3 items-center gap-4">
                                <Skeleton className="h-5 w-24 justify-self-end" />
                                <div className="col-span-2"><Skeleton className="h-8 w-full max-w-sm" /></div>
                             </div>
                        ))}
                    </div>
                </CardContent>
                 <CardFooter className="mt-6 flex justify-between border-t pt-6">
                    <Skeleton className="h-10 w-24" />
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
        <span>{t('editRoom.breadcrumb', {name: room.login})}</span>
      </div>
      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{t('editRoom.title')}</CardTitle>
                <div className="flex gap-2">
                    <Button asChild variant="outline" className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
                        <Link href={`/my-rooms/${id}/users`}>{t('editRoom.users')}</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white">
                       <Link href={`/my-rooms/${id}/games`}>{t('editRoom.games')}</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    <ReadOnlyRow label={t('editRoom.login')} value={`${room.login} / Individual`} />
                    <FormRow label={t('editRoom.active')}>
                        <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange('active')} />
                    </FormRow>
                    <ReadOnlyRow label="ID" value={room.id} />
                    <ReadOnlyRow label={t('editRoom.currency')} value={room.currency} />
                    <FormRow label={t('editRoom.demoBalance')}>
                        <Input id="demoBalance" value={formData.demoBalance} onChange={handleInputChange} />
                    </FormRow>
                    <FormRow label={t('editRoom.egtJackpots')}>
                        <Switch id="egtJackpots" checked={formData.egtJackpots} onCheckedChange={handleSwitchChange('egtJackpots')} />
                    </FormRow>
                     <FormRow label="RTP">
                        <Select value={formData.rtp} onValueChange={handleSelectChange('rtp')}>
                            <SelectTrigger className='max-w-sm'><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="92">92</SelectItem>
                                <SelectItem value="97">97</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormRow>
                    <FormRow label={t('editRoom.minTotalBet')}>
                        <Input id="minTotalBet" value={formData.minTotalBet} onChange={handleInputChange} className="max-w-sm" />
                    </FormRow>
                    <FormRow label={t('editRoom.maxTotalBet')}>
                        <Input id="maxTotalBet" value={formData.maxTotalBet} onChange={handleInputChange} className="max-w-sm" />
                    </FormRow>
                    <FormRow label={t('editRoom.sportMinBet')}>
                        <Input id="sportMinBet" value={formData.sportMinBet} onChange={handleInputChange} className="max-w-sm" />
                    </FormRow>
                    <FormRow label={t('editRoom.sportMaxBet')}>
                        <Input id="sportMaxBet" value={formData.sportMaxBet} onChange={handleInputChange} className="max-w-sm" />
                    </FormRow>
                    <FormRow label={t('editRoom.ratio')}>
                        <Select value={formData.ratio} onValueChange={handleSelectChange('ratio')}>
                            <SelectTrigger className='max-w-sm'><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3x4">3x4</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormRow>
                    <FormRow label={t('editRoom.hallKey')}>
                        <div className="flex items-center gap-2">
                            <Input id="hallKey" value={formData.hallKey} readOnly />
                            <Button variant="outline" size="icon" type="button" onClick={handleCopyKey}><Copy className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" type="button" onClick={handleRefreshKey}><RefreshCw className="h-4 w-4" /></Button>
                            <Button type="button" className="bg-purple-600 hover:bg-purple-700 ml-2">{t('editRoom.testApi')}</Button>
                        </div>
                    </FormRow>
                </div>
            </CardContent>
            <CardFooter className="mt-6 flex justify-start border-t pt-6">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">{t('editRoom.save')}</Button>
            </CardFooter>
        </Card>
      </form>
    </main>
  );
}
