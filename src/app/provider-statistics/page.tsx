
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
import { providerStatisticsData } from '@/lib/data';
import type { ProviderStatistic } from '@/lib/types';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { useTranslation } from 'react-i18next';

const ProviderStatisticsTable = ({ data }: { data: ProviderStatistic[] }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-[#23303a]">
          <TableRow>
            <TableHead className="text-center">{t('providerStatistics.table.provider')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.seal')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.bet')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.win')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.winnings')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.wager')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.addedBet')}</TableHead>
            <TableHead className="text-center">{t('providerStatistics.table.rtp')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.provider + entry.seal}>
                <TableCell className="text-center">{entry.provider}</TableCell>
                <TableCell className="text-center">{entry.seal}</TableCell>
                <TableCell className="text-center">{formatCurrency(entry.bet)}</TableCell>
                <TableCell className="text-center">{formatCurrency(entry.win)}</TableCell>
                <TableCell className={`text-center font-medium ${entry.winnings < 0 ? 'text-red-500' : ''}`}>{formatCurrency(entry.winnings)}</TableCell>
                <TableCell className="text-center">{formatCurrency(entry.wager)}</TableCell>
                <TableCell className="text-center">{formatCurrency(entry.addedBet)}</TableCell>
                <TableCell className="text-center">{formatPercentage(entry.rtp)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {t('providerStatistics.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default function ProviderStatisticsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date('2025-12-29T00:00:00')
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date('2025-12-29T23:59:59')
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
    return providerStatisticsData;
  }, []);

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
        <span>{t('providerStatistics.breadcrumb')}</span>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-xl">{t('providerStatistics.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <FileSpreadsheet className="h-5 w-5" />
              <span className="sr-only">{t('providerStatistics.export')}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">{t('providerStatistics.refresh')}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 items-end">
              <div className="flex items-end gap-2 col-span-1 md:col-span-2">
                <div className="flex flex-col gap-2 flex-1">
                    <Label>{t('providerStatistics.from')}</Label>
                    <div className='flex gap-2'>
                        <DatePicker
                            date={fromDate}
                            setDate={setFromDate}
                            className="w-full"
                        />
                        <Input
                            type="text"
                            placeholder="00:00:00"
                            value={fromTime}
                            onChange={(e) => handleTimeChange(e, setFromTime)}
                            maxLength={8}
                            className="w-[100px]"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <Label>{t('providerStatistics.to')}</Label>
                    <div className='flex gap-2'>
                        <DatePicker
                            date={toDate}
                            setDate={setToDate}
                            className="w-full"
                        />
                         <Input
                            type="text"
                            placeholder="23:59:59"
                            value={toTime}
                            onChange={(e) => handleTimeChange(e, setToTime)}
                            maxLength={8}
                            className="w-[100px]"
                        />
                    </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">{t('providerStatistics.type')}</Label>
                <Select defaultValue="labels">
                    <SelectTrigger id="type">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="labels">{t('providerStatistics.labels')}</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="currency">{t('providerStatistics.currency')}</Label>
                    <Select defaultValue="ARS">
                        <SelectTrigger id="currency">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="ARS">ARS</SelectItem>
                           <SelectItem value="USD">USD</SelectItem>
                           <SelectItem value="UYU">UYU</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end items-end gap-2">
                     <div className="flex flex-col gap-2">
                        <Label htmlFor="period">{t('providerStatistics.period')}</Label>
                        <Select>
                        <SelectTrigger id="period">
                            <SelectValue placeholder={t('providerStatistics.period')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">{t('providerStatistics.today')}</SelectItem>
                            <SelectItem value="yesterday">{t('providerStatistics.yesterday')}</SelectItem>
                            <SelectItem value="this_week">{t('providerStatistics.thisWeek')}</SelectItem>
                            <SelectItem value="this_month">{t('providerStatistics.thisMonth')}</SelectItem>
                            <SelectItem value="last_month">{t('providerStatistics.lastMonth')}</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">{t('providerStatistics.show')}</Button>
                </div>
            </div>
          </div>
          {loading ? (
             <TableSkeleton columns={8} rows={itemsPerPage} />
          ) : (
            <ProviderStatisticsTable data={paginatedData} />
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
