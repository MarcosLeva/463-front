
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Home, ChevronRight, Gamepad2, PlusCircle, MonitorSmartphone } from 'lucide-react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import Link from 'next/link';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

const MyRoomsTable = ({ data, currencyTotals, currentPage }: { data: Room[], currencyTotals: Record<string, { totalBet: number; totalWin: number; profit: number; }>, currentPage: number }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };
  
  const sortedCurrencies = useMemo(() => Object.keys(currencyTotals).sort(), [currencyTotals]);

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-[#23303a]">
          <TableRow>
            <TableHead>{t('myRooms.table.id')}</TableHead>
            <TableHead></TableHead>
            <TableHead>{t('myRooms.table.login')}</TableHead>
            <TableHead></TableHead>
            <TableHead>{t('myRooms.table.currency')}</TableHead>
            <TableHead className="text-right">{t('myRooms.table.totalBet')}</TableHead>
            <TableHead className="text-right">{t('myRooms.table.totalWin')}</TableHead>
            <TableHead className="text-right">{t('myRooms.table.profit')}</TableHead>
            <TableHead className="text-right">{t('myRooms.table.rtp')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPage === 1 && sortedCurrencies.map((currency) => {
            const total = currencyTotals[currency];
            const profitColor = total.profit >= 0 ? 'text-green-500' : 'text-red-500';
            const rtp = total.totalBet > 0 ? (total.totalWin / total.totalBet) * 100 : 0;
            return (
              <TableRow key={`total-${currency}`} className="font-bold">
                <TableCell colSpan={4}></TableCell>
                <TableCell>{currency}</TableCell>
                <TableCell className="text-right text-green-500">{formatCurrency(total.totalBet)}</TableCell>
                <TableCell className="text-right text-green-500">{formatCurrency(total.totalWin)}</TableCell>
                <TableCell className={`text-right ${profitColor}`}>{formatCurrency(total.profit)}</TableCell>
                <TableCell className="text-right">{rtp.toFixed(2)}%</TableCell>
              </TableRow>
            );
          })}
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>
                </TableCell>
                <TableCell>
                    <div className='flex items-center gap-2'>
                        <Link href={`/my-rooms/${entry.id}/edit`} className="text-primary hover:underline">{entry.login}</Link>
                        <Link href={`/my-rooms/${entry.id}`}>
                          <Gamepad2 className='h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary' />
                        </Link>
                    </div>
                </TableCell>
                <TableCell>
                  <Link href={`/my-rooms/${entry.id}/users`}>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground hover:text-primary cursor-pointer">
                        <MonitorSmartphone className="h-4 w-4" />
                        <span>{entry.terminals}</span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{entry.currency}</TableCell>
                <TableCell className="text-right">{formatCurrency(entry.totalBet)}</TableCell>
                <TableCell className="text-right">{formatCurrency(entry.totalWin)}</TableCell>
                <TableCell className={`text-right ${entry.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(entry.profit)}
                </TableCell>
                <TableCell className="text-right">{entry.rtp.toFixed(2)}%</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {t('myRooms.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default function MyRoomsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date('2026-01-17T00:00:00')
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date('2026-01-17T23:59:59')
  );
  const [fromTime, setFromTime] = useState('00:00:00');
  const [toTime, setToTime] = useState('23:59:59');

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  const filteredData = useMemo(() => {
    return roomsData;
  }, []);
  
  const currencyTotals = useMemo(() => {
    return filteredData.reduce((acc, room) => {
      const currency = room.currency;
      if (!acc[currency]) {
        acc[currency] = { totalBet: 0, totalWin: 0, profit: 0 };
      }
      acc[currency].totalBet += room.totalBet;
      acc[currency].totalWin += room.totalWin;
      acc[currency].profit += room.profit;
      return acc;
    }, {} as Record<string, { totalBet: number; totalWin: number; profit: number; }>);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);


  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
        <ChevronRight className="h-4 w-4" />
        <span>{t('myRooms.breadcrumb')}</span>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('myRooms.title')}</CardTitle>
            <div className="flex justify-end">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/my-rooms/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('myRooms.createRoom')}
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
              <div className="flex flex-col gap-2">
                <Label>{t('myRooms.from')}</Label>
                <div className='flex gap-0.5'>
                    <DatePicker
                        date={fromDate}
                        setDate={setFromDate}
                        className="w-full rounded-r-none"
                    />
                    <Input
                        id="from-time"
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
                <Label>{t('myRooms.to')}</Label>
                <div className='flex gap-0.5'>
                    <DatePicker
                        date={toDate}
                        setDate={setToDate}
                        className="w-full rounded-r-none"
                    />
                     <Input
                        id="to-time"
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
                <Label htmlFor="all1">{t('myRooms.all')}</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="all1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('myRooms.all')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="all2">{t('myRooms.all')}</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="all2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('myRooms.all')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-green-600 hover:bg-green-700">{t('myRooms.show')}</Button>
              </div>
            </div>
          </div>
          {loading ? (
             <TableSkeleton columns={9} rows={itemsPerPage} />
          ) : (
            <MyRoomsTable data={paginatedData} currencyTotals={currencyTotals} currentPage={currentPage} />
          )}
        </CardContent>
        <CardFooter>
          {!loading && (
             <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
