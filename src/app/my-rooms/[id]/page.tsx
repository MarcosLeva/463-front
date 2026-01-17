
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';

const gameStatsData = [{
    totalBet: 0.00,
    totalWin: 0.00,
}];

const GameStatisticsTable = ({ data }: { data: any[] }) => {
    const { t } = useTranslation();
    const formatCurrency = (amount: number) => amount.toFixed(2);
    
    const summary = data[0] || { totalBet: 0, totalWin: 0 };
    const winLose = summary.totalWin - summary.totalBet;
    const rtp = summary.totalBet > 0 ? (summary.totalWin / summary.totalBet) * 100 : 0;

    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table>
                <TableHeader className="bg-[#23303a]">
                    <TableRow>
                        <TableHead>{t('gameStatistics.table.game')}</TableHead>
                        <TableHead className='text-right'>{t('gameStatistics.table.totalBet')}</TableHead>
                        <TableHead className='text-right'>{t('gameStatistics.table.totalWin')}</TableHead>
                        <TableHead className='text-right'>{t('gameStatistics.table.winLose')}</TableHead>
                        <TableHead className='text-right'>{t('gameStatistics.table.rtp')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell className="text-right">{formatCurrency(summary.totalBet)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(summary.totalWin)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(winLose)}</TableCell>
                        <TableCell className="text-right">{rtp.toFixed(2)}%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default function HallDetailsPage() {
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
            <TableSkeleton columns={5} rows={2} />
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
        <span>{room.login}</span>
      </div>
      <Card>
        <CardContent className="space-y-6 pt-6">
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-2">
                    <Label>{t('gameStatistics.filters.from')}</Label>
                    <div className='flex items-center'>
                       <DatePicker date={fromDate} setDate={setFromDate} className="rounded-r-none" />
                       <Input type="text" value={fromTime} onChange={(e) => handleTimeChange(e, setFromTime)} maxLength={8} className="w-[100px] rounded-l-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>{t('gameStatistics.filters.to')}</Label>
                     <div className='flex items-center'>
                        <DatePicker date={toDate} setDate={setToDate} className="rounded-r-none" />
                        <Input type="text" value={toTime} onChange={(e) => handleTimeChange(e, setToTime)} maxLength={8} className="w-[100px] rounded-l-none" />
                    </div>
                </div>
                <Select defaultValue="today">
                    <SelectTrigger id="period" className='w-auto'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">{t('gameStatistics.filters.today')}</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700">{t('gameStatistics.filters.show')}</Button>
            </div>
          
            {loading ? (
                <TableSkeleton columns={5} rows={2} />
            ) : (
                <GameStatisticsTable data={gameStatsData} />
            )}
        </CardContent>
      </Card>
    </main>
  );
}
