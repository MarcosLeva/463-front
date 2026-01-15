
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
import { changesData } from '@/lib/data';
import type { ChangeLogEntry } from '@/lib/types';
import { Home, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { useTranslation } from 'react-i18next';

const ChangesTable = ({ data }: { data: ChangeLogEntry[] }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-[#23303a]">
          <TableRow>
            <TableHead>{t('changes.table.id')}</TableHead>
            <TableHead>{t('changes.table.initiator')}</TableHead>
            <TableHead>{t('changes.table.user')}</TableHead>
            <TableHead>{t('changes.table.page')}</TableHead>
            <TableHead>{t('changes.table.action')}</TableHead>
            <TableHead>{t('changes.table.changes')}</TableHead>
            <TableHead>{t('changes.table.ip')}</TableHead>
            <TableHead>{t('changes.table.date')}</TableHead>
            <TableHead>{t('changes.table.time')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.initiator}</TableCell>
                <TableCell>{entry.user}</TableCell>
                <TableCell>{entry.page}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>
                  <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                    {JSON.stringify(entry.changes, null, 2) || 'null'}
                  </pre>
                </TableCell>
                <TableCell>{entry.ip}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.time}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {t('changes.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default function ChangesPage() {
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
    return changesData;
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
        <span>{t('changes.breadcrumb')}</span>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{t('changes.title')}</CardTitle>
          <Button variant="ghost" size="icon">
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">{t('changes.refresh')}</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-end">
              <div className="flex items-end gap-2 col-span-1 md:col-span-2 lg:col-span-2">
                <div className="flex flex-col gap-2 flex-1">
                    <Label>{t('changes.from')}</Label>
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
                    <Label>{t('changes.to')}</Label>
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
              <div className="flex items-end gap-2">
                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                  <Label htmlFor="period">{t('changes.period')}</Label>
                  <Select>
                    <SelectTrigger id="period">
                      <SelectValue placeholder={t('changes.period')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">{t('changes.today')}</SelectItem>
                      <SelectItem value="yesterday">{t('changes.yesterday')}</SelectItem>
                      <SelectItem value="this_week">{t('changes.thisWeek')}</SelectItem>
                      <SelectItem value="this_month">{t('changes.thisMonth')}</SelectItem>
                      <SelectItem value="last_month">{t('changes.lastMonth')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-auto bg-green-600 hover:bg-green-700">{t('changes.show')}</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
                 <div className="flex items-center gap-2">
                    <Label htmlFor="page" className="shrink-0">{t('changes.page')}</Label>
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
                    <Label htmlFor="limit" className="shrink-0">{t('changes.limits')}</Label>
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
                <div className="flex items-center gap-2">
                    <Label htmlFor="initiator" className="shrink-0">{t('changes.initiator')}:</Label>
                    <Switch id="initiator" />
                </div>
            </div>
          </div>
          {loading ? (
             <TableSkeleton columns={9} rows={itemsPerPage} />
          ) : (
             <ChangesTable data={paginatedData} />
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
