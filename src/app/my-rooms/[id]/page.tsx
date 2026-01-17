
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Home, ChevronRight, RefreshCw, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const hallDetailsData = [{
    login: 'user123',
    totalBet: 0.00,
    totalWin: 0.00,
    profit: 0.00,
    rtp: 0,
    jackpots: 0.00,
    fg: 0.00,
}];

const HallDetailsTable = ({ data }: { data: any[] }) => {
    const { t } = useTranslation();
    const formatCurrency = (amount: number) => amount.toFixed(2);

    return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table>
                <TableHeader className="bg-[#23303a]">
                    <TableRow>
                        <TableHead>{t('hallDetails.table.login')}</TableHead>
                        <TableHead>{t('hallDetails.table.totalBet')}</TableHead>
                        <TableHead>{t('hallDetails.table.totalWin')}</TableHead>
                        <TableHead>{t('hallDetails.table.profit')}</TableHead>
                        <TableHead>{t('hallDetails.table.rtp')}</TableHead>
                        <TableHead>{t('hallDetails.table.jackpots')}</TableHead>
                        <TableHead>{t('hallDetails.table.fg')}</TableHead>
                        <TableHead className="text-center">{t('hallDetails.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>{entry.login}</TableCell>
                                <TableCell className="bg-green-700 text-white">{formatCurrency(entry.totalBet)}</TableCell>
                                <TableCell className="bg-red-700 text-white">{formatCurrency(entry.totalWin)}</TableCell>
                                <TableCell className="bg-blue-700 text-white">{formatCurrency(entry.profit)}</TableCell>
                                <TableCell>{entry.rtp.toFixed(2)}%</TableCell>
                                <TableCell>{formatCurrency(entry.jackpots)}</TableCell>
                                <TableCell>{formatCurrency(entry.fg)}</TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>{t('hallDetails.table.action_details')}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                {t('hallDetails.noData')}
                            </TableCell>
                        </TableRow>
                    )}
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
    // Simulate fetching room data
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

    if (rawValue.length > 0) {
      formattedValue = rawValue.slice(0, 2);
    }
    if (rawValue.length > 2) {
      formattedValue += ':' + rawValue.slice(2, 4);
    }
    if (rawValue.length > 4) {
      formattedValue += ':' + rawValue.slice(4, 6);
    }

    setter(formattedValue);
  };
  
  if (loading) {
      return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <TableSkeleton columns={8} rows={5} />
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
            {/* Filters */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="login-search">{t('hallDetails.filters.login')}</Label>
                        <Input id="login-search" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>{t('hallDetails.filters.from')}</Label>
                        <div className='flex gap-0.5'>
                            <DatePicker
                                date={fromDate}
                                setDate={setFromDate}
                                className="w-full rounded-r-none"
                            />
                            <Input
                                type="text"
                                placeholder="00:00:00"
                                value={fromTime}
                                onChange={(e) => handleTimeChange(e, setFromTime)}
                                maxLength={8}
                                className="w-[100px] rounded-l-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>{t('hallDetails.filters.to')}</Label>
                        <div className='flex gap-0.5'>
                            <DatePicker
                                date={toDate}
                                setDate={setToDate}
                                className="w-full rounded-r-none"
                            />
                            <Input
                                type="text"
                                placeholder="23:59:59"
                                value={toTime}
                                onChange={(e) => handleTimeChange(e, setToTime)}
                                maxLength={8}
                                className="w-[100px] rounded-l-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="period">{t('hallDetails.filters.period')}</Label>
                        <Select defaultValue="today">
                            <SelectTrigger id="period"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">{t('hallDetails.filters.today')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="all1">{t('hallDetails.filters.all')}</Label>
                        <Select defaultValue="all">
                            <SelectTrigger id="all1"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="all">{t('hallDetails.filters.all')}</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700">{t('hallDetails.filters.show')}</Button>
                </div>
            </div>

            {/* Sub-header */}
            <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                 <Button className="bg-green-600 hover:bg-green-700">{t('hallDetails.editHall')}</Button>
                 <Button variant="outline" className="bg-purple-600 hover:bg-purple-700 text-white"><RefreshCw className="mr-2 h-4 w-4" />{t('hallDetails.refresh')}</Button>
            </div>
          
            {/* Table */}
            <HallDetailsTable data={hallDetailsData} />
        </CardContent>
      </Card>
    </main>
  );
}
