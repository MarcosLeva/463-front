
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
  TableFooter,
} from '@/components/ui/table';
import { balanceHistoryData } from '@/lib/data';
import type { BalanceHistoryEntry } from '@/lib/types';
import { FileSpreadsheet, Home, ChevronRight } from 'lucide-react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import Link from 'next/link';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { useTranslation } from 'react-i18next';

const BalanceHistoryTable = ({ data }: { data: BalanceHistoryEntry[] }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };
  
  const totals = data.reduce((acc, curr) => {
    acc.deposit += curr.deposit;
    acc.withdraw += curr.withdraw;
    acc.wager += curr.wager;
    return acc;
  }, { deposit: 0, withdraw: 0, wager: 0 });
  
  const totalWinnings = data.reduce((acc, curr) => acc + curr.wager, 0);


  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-[#23303a]">
          <TableRow>
            <TableHead>{t('balanceHistory.table.id')}</TableHead>
            <TableHead>{t('balanceHistory.table.operation')}</TableHead>
            <TableHead>{t('balanceHistory.table.deposit')}</TableHead>
            <TableHead>{t('balanceHistory.table.withdraw')}</TableHead>
            <TableHead>{t('balanceHistory.table.wager')}</TableHead>
            <TableHead>{t('balanceHistory.table.betLimit')}</TableHead>
            <TableHead>{t('balanceHistory.table.balanceBefore')}</TableHead>
            <TableHead>{t('balanceHistory.table.currency')}</TableHead>
            <TableHead>{t('balanceHistory.table.date')}</TableHead>
            <TableHead>{t('balanceHistory.table.time')}</TableHead>
            <TableHead>{t('balanceHistory.table.initiator')}</TableHead>
            <TableHead>{t('balanceHistory.table.fromUser')}</TableHead>
            <TableHead>{t('balanceHistory.table.system')}</TableHead>
            <TableHead>{t('balanceHistory.table.toUser')}</TableHead>
            <TableHead>{t('balanceHistory.table.ip')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.operation}</TableCell>
                <TableCell>{formatCurrency(entry.deposit)}</TableCell>
                <TableCell>{formatCurrency(entry.withdraw)}</TableCell>
                <TableCell>{formatCurrency(entry.wager)}</TableCell>
                <TableCell>{formatCurrency(entry.betLimit)}</TableCell>
                <TableCell>{formatCurrency(entry.balanceBefore)}</TableCell>
                <TableCell>{entry.currency}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.initiator}</TableCell>
                <TableCell>{entry.fromUser}</TableCell>
                <TableCell>{entry.system}</TableCell>
                <TableCell>{entry.toUser}</TableCell>
                <TableCell>{entry.ip}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} className="h-24 text-center">
                {t('balanceHistory.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-bold">{t('balanceHistory.footer.total')}</TableCell>
            <TableCell>{formatCurrency(totals.deposit)}</TableCell>
            <TableCell>{formatCurrency(totals.withdraw)}</TableCell>
            <TableCell>{formatCurrency(totals.wager)}</TableCell>
            <TableCell colSpan={10}></TableCell>
          </TableRow>
          <TableRow>
             <TableCell colSpan={2} className="font-bold">{t('balanceHistory.footer.winnings')}</TableCell>
             <TableCell>{formatCurrency(totalWinnings)}</TableCell>
             <TableCell colSpan={12}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default function BalanceHistoryPage() {
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
    // This is where you would filter data based on date/time pickers
    // For now, it just returns all data
    return balanceHistoryData;
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
        <span>{t('balanceHistory.breadcrumb')}</span>
      </div>
      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <CardTitle>{t('balanceHistory.title')}</CardTitle>
          <Button variant="ghost" size="icon">
              <FileSpreadsheet className="h-5 w-5" />
              <span className="sr-only">{t('balanceHistory.export')}</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 items-end">
              <div className="flex flex-col gap-2">
                <Label>{t('balanceHistory.from')}</Label>
                <DatePicker
                    date={fromDate}
                    setDate={setFromDate}
                    className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('balanceHistory.to')}</Label>
                <DatePicker
                    date={toDate}
                    setDate={setToDate}
                    className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="from-time">{t('balanceHistory.fromTime')}</Label>
                <Input
                    id="from-time"
                    type="text"
                    placeholder="00:00:00"
                    value={fromTime}
                    onChange={(e) => handleTimeChange(e, setFromTime)}
                    maxLength={8}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="to-time">{t('balanceHistory.toTime')}</Label>
                <Input
                    id="to-time"
                    type="text"
                    placeholder="23:59:59"
                    value={toTime}
                    onChange={(e) => handleTimeChange(e, setToTime)}
                    maxLength={8}
                />
              </div>

               <div className="flex flex-col gap-2">
                <Label htmlFor="period">{t('balanceHistory.period')}</Label>
                <Select>
                  <SelectTrigger id="period">
                    <SelectValue placeholder={t('balanceHistory.period')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{t('balanceHistory.today')}</SelectItem>
                    <SelectItem value="yesterday">{t('balanceHistory.yesterday')}</SelectItem>
                    <SelectItem value="this_week">{t('balanceHistory.thisWeek')}</SelectItem>
                    <SelectItem value="this_month">{t('balanceHistory.thisMonth')}</SelectItem>
                    <SelectItem value="last_month">{t('balanceHistory.lastMonth')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
                 <div className="flex items-center gap-2">
                    <Label htmlFor="page" className="shrink-0">{t('balanceHistory.page')}</Label>
                    <Select value={String(currentPage)} onValueChange={(val) => setCurrentPage(Number(val))}>
                        <SelectTrigger id="page">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <SelectItem key={page} value={String(page)}>{page}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex items-center gap-2">
                    <Label htmlFor="limit" className="shrink-0">{t('balanceHistory.limits')}</Label>
                    <Select value={String(itemsPerPage)} onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                        <SelectTrigger id="limit">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {[10, 20, 50, 100].map(limit => (
                            <SelectItem key={limit} value={String(limit)}>{limit}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="operation-type">{t('balanceHistory.operationType')}</Label>
                    <Select defaultValue="to_user">
                        <SelectTrigger id="operation-type">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="to_user">{t('balanceHistory.toUser')}</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="currency">{t('balanceHistory.currency')}</Label>
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
            </div>
          </div>
          {loading ? (
             <TableSkeleton columns={15} rows={itemsPerPage} />
          ) : (
            <BalanceHistoryTable data={paginatedData} />
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
