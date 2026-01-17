
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
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
import { DatePicker } from '@/components/dashboard/date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { roomsData } from '@/lib/data';
import type { Room } from '@/lib/types';
import { Home, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { useTranslation } from 'react-i18next';

const hallUsersData = [{
    login: 'user123',
    totalBet: 0.00,
    totalWin: 0.00,
    profit: 0.00,
    rtp: 0.00,
    jackpots: 0.00,
    fg: 0.00,
}];

const HallUsersTable = ({ data }: { data: any[] }) => {
    const { t } = useTranslation();
    const formatCurrency = (amount: number) => amount.toFixed(2);

    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table>
                <TableHeader className="bg-[#23303a]">
                    <TableRow>
                        <TableHead>{t('hallDetails.table.login')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.totalBet')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.totalWin')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.profit')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.rtp')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.jackpots')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.fg')}</TableHead>
                        <TableHead className='text-center'>{t('hallDetails.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {data.length > 0 ? data.map((user, index) => (
                       <TableRow key={index}>
                           <TableCell>{user.login}</TableCell>
                           <TableCell className="text-center bg-green-600 text-white">{formatCurrency(user.totalBet)}</TableCell>
                           <TableCell className="text-center bg-red-600 text-white">{formatCurrency(user.totalWin)}</TableCell>
                           <TableCell className="text-center bg-blue-600 text-white">{formatCurrency(user.profit)}</TableCell>
                           <TableCell className="text-center">{user.rtp.toFixed(2)}%</TableCell>
                           <TableCell className="text-center">{formatCurrency(user.jackpots)}</TableCell>
                           <TableCell className="text-center">{formatCurrency(user.fg)}</TableCell>
                           <TableCell className="text-center">
                               <Button variant="outline">{t('hallDetails.table.action_details')}</Button>
                           </TableCell>
                       </TableRow>
                   )) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">{t('hallDetails.noData')}</TableCell>
                        </TableRow>
                   )}
                </TableBody>
            </Table>
        </div>
    );
};

export default function HallUsersPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);

  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date('2026-01-17T00:00:00')
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date('2026-01-17T23:59:59')
  );
  const [fromTime, setFromTime] = useState('00:00:00');
  const [toTime, setToTime] = useState('23:59:59');

  useEffect(() => {
    const foundRoom = roomsData.find(r => r.id.toString() === id);
    if (foundRoom) {
      setRoom(foundRoom);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';

    if (rawValue.length > 0) formattedValue = rawValue.slice(0, 2);
    if (rawValue.length > 2) formattedValue += ':' + rawValue.slice(2, 4);
    if (rawValue.length > 4) formattedValue += ':' + rawValue.slice(4, 6);

    setter(formattedValue);
  };
  
  if (loading && !room) {
      return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <TableSkeleton columns={8} rows={2} />
        </main>
      );
  }

  if (!room) {
    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <p>Room not found.</p>
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
        <span>{t('editRoom.users')}</span>
      </div>
      <Card>
        <CardContent className="space-y-6 pt-6">
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="login">{t('hallDetails.filters.login')}</Label>
                    <Input id="login" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>{t('hallDetails.filters.from')}</Label>
                    <div className='flex items-center'>
                       <DatePicker date={fromDate} setDate={setFromDate} className="rounded-r-none" />
                       <Input type="text" value={fromTime} onChange={(e) => handleTimeChange(e, setFromTime)} maxLength={8} placeholder="00:00:00" className="w-[100px] rounded-l-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>{t('hallDetails.filters.to')}</Label>
                     <div className='flex items-center'>
                        <DatePicker date={toDate} setDate={setToDate} className="rounded-r-none" />
                        <Input type="text" value={toTime} onChange={(e) => handleTimeChange(e, setToTime)} maxLength={8} placeholder="23:59:59" className="w-[100px] rounded-l-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 self-end">
                  <Select defaultValue="today">
                      <SelectTrigger id="period" className='w-auto'>
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="today">{t('hallDetails.filters.today')}</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 self-end">
                    <Select defaultValue="all"><SelectTrigger className="w-auto"><SelectValue placeholder={t('hallDetails.filters.all')} /></SelectTrigger><SelectContent><SelectItem value="all">{t('hallDetails.filters.all')}</SelectItem></SelectContent></Select>
                </div>
                <div className="flex flex-col gap-2 self-end">
                    <Select defaultValue="all"><SelectTrigger className="w-auto"><SelectValue placeholder={t('hallDetails.filters.all')} /></SelectTrigger><SelectContent><SelectItem value="all">{t('hallDetails.filters.all')}</SelectItem></SelectContent></Select>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">{t('hallDetails.filters.show')}</Button>
            </div>
            
            <div className="flex items-center justify-between border-y py-2 px-4 bg-muted/30">
                <Button asChild className="bg-green-600 hover:bg-green-700"><Link href={`/my-rooms/${id}/edit`}>{t('hallDetails.editHall')}</Link></Button>
                <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white"><RefreshCw className="mr-2 h-4 w-4" />{t('hallDetails.refresh')}</Button>
            </div>

            {loading ? (
                <TableSkeleton columns={8} rows={2} />
            ) : (
                <HallUsersTable data={hallUsersData} />
            )}
        </CardContent>
      </Card>
    </main>
  );
}
