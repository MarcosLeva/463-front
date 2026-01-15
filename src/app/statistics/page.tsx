
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
import { users as statisticsData } from '@/lib/data';
import type { StatisticsEntry, FilterCondition } from '@/lib/types';
import { FileSpreadsheet, Home, ChevronRight, Search, X, UserPlus, Trash2 } from 'lucide-react';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { AddFilterDialog } from '@/components/statistics/add-filter-dialog';
import { Badge } from '@/components/ui/badge';
import { CreateUserDialog } from '@/components/dashboard/create-user-dialog';
import { TableSkeleton } from '@/components/dashboard/table-skeleton';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const StatisticsTable = ({ data }: { data: StatisticsEntry[] }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalDeposits = data.reduce((acc, curr) => acc + curr.deposits, 0);
  const totalWithdrawals = data.reduce((acc, curr) => acc + curr.withdrawals, 0);
  const totalWinnings = data.reduce((acc, curr) => acc + curr.winnings, 0);

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-[#23303a]">
          <TableRow>
            <TableHead>{t('statistics.table.userId')}</TableHead>
            <TableHead>{t('statistics.table.login')}</TableHead>
            <TableHead className="text-right">{t('statistics.table.deposit')}</TableHead>
            <TableHead className="text-right">{t('statistics.table.withdraw')}</TableHead>
            <TableHead className="text-right">{t('statistics.table.winnings')}</TableHead>
            <TableHead className="text-right">{t('statistics.table.rtp')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.login}</TableCell>
                <TableCell className="text-right text-green-600 dark:text-green-400">
                    {formatCurrency(entry.deposits)}
                </TableCell>
                <TableCell className="text-right text-red-600 dark:text-red-400">
                    {formatCurrency(entry.withdrawals)}
                </TableCell>
                <TableCell className="text-right">
                   <Badge
                        variant={entry.winnings >= 0 ? "default" : "destructive"}
                        className={
                          entry.winnings > 0
                            ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/30"
                            : entry.winnings < 0
                            ? "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30"
                            : ""
                        }
                      >
                        {formatCurrency(entry.winnings)}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">64.65</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t('statistics.noData')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2} className="font-bold">{t('statistics.table.total')}</TableCell>
                <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(totalDeposits)}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalWithdrawals)}
                </TableCell>
                <TableCell className="text-right font-bold">
                    <Badge
                        variant={totalWinnings >= 0 ? "default" : "destructive"}
                        className={
                          totalWinnings > 0
                            ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/30"
                            : totalWinnings < 0
                            ? "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30"
                            : ""
                        }
                      >
                        {formatCurrency(totalWinnings)}
                    </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">64.43</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};


export default function StatisticsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date('2026-01-02T00:00:00')
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date('2026-01-02T23:59:59')
  );
  const [fromTime, setFromTime] = useState('00:00:00');
  const [toTime, setToTime] = useState('23:59:59');
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  const addFilter = (filter: FilterCondition) => {
    setFilters(prev => [...prev, filter]);
  };

  const removeFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }

  const handleSearch = () => {
    setSearchTerm(searchText);
    setCurrentPage(1);
  }

  const clearSearch = () => {
    setSearchText("");
    setSearchTerm("");
    setCurrentPage(1);
  }


  const filteredData = useMemo(() => {
    let data = statisticsData;
    if (searchTerm) {
        const lowercasedSearch = searchTerm.toLowerCase();
        data = data.filter(user => 
            user.id.toLowerCase().includes(lowercasedSearch) ||
            user.login.toLowerCase().includes(lowercasedSearch) ||
            user.name.toLowerCase().includes(lowercasedSearch)
        );
    }
    return data;
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
       <AddFilterDialog 
        isOpen={isFilterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onAddFilter={addFilter}
      />
       <CreateUserDialog isOpen={isUserDialogOpen} onClose={() => setUserDialogOpen(false)} />
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
        <ChevronRight className="h-4 w-4" />
        <span>{t('statistics.breadcrumb')}</span>
      </div>
      <Card>
        <CardContent className="space-y-6 pt-6">
           <div className="space-y-4">
              <div className="grid grid-cols-[150px_auto] items-center gap-x-4">
                <Label htmlFor="stats-type">{t('statistics.statsType')}</Label>
                <div className='w-full max-w-xs'>
                    <Select defaultValue="cash">
                        <SelectTrigger id="stats-type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">{t('statistics.cash')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="grid grid-cols-[150px_auto] items-center gap-x-4">
                <Label htmlFor="convert-amounts">{t('statistics.convertAmounts')}</Label>
                <div className='w-full max-w-xs'>
                  <Select defaultValue="selected-currency">
                      <SelectTrigger id="convert-amounts"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="selected-currency">{t('statistics.showInSelectedCurrency')}</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-[150px_auto] items-center gap-x-4">
                   <Label htmlFor="group-by">{t('statistics.groupBy')}</Label>
                   <div className='flex gap-2'>
                       <div className='w-full max-w-[190px]'>
                         <Select defaultValue="superagent">
                             <SelectTrigger id="group-by"><SelectValue /></SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="superagent">{t('statistics.superAgent')}</SelectItem>
                             </SelectContent>
                         </Select>
                       </div>
                       <div className='w-full max-w-[190px]'>
                         <Select>
                             <SelectTrigger><SelectValue placeholder={t('statistics.selectType')} /></SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="type1">Tipo 1</SelectItem>
                             </SelectContent>
                         </Select>
                       </div>
                   </div>
              </div>

               <div className="grid grid-cols-[150px_auto] items-center gap-x-4">
                   <Label htmlFor="table-config">{t('statistics.tableConfig')}</Label>
                   <div className='flex gap-2'>
                      <div className='w-full max-w-[190px]'>
                        <Select>
                            <SelectTrigger id="table-config"><SelectValue placeholder={t('statistics.selectColumns')} /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="col1">Columna 1</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                      <div className='w-full max-w-[190px]'>
                        <Select defaultValue="ARS">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ARS">ARS</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="UYU">UYU</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-[150px_auto_auto_auto_1fr] items-center gap-x-4">
                <Label>{t('statistics.periodStart')}</Label>
                <div className="flex w-full max-w-[190px]">
                    <DatePicker date={fromDate} setDate={setFromDate} className="rounded-r-none" />
                    <Input type="text" placeholder="00:00:00" value={fromTime} onChange={(e) => handleTimeChange(e, setFromTime)} maxLength={8} className="w-28 rounded-l-none" />
                </div>
                <Label className='text-right'>{t('statistics.periodEnd')}</Label>
                <div className="flex w-full max-w-[190px]">
                    <DatePicker date={toDate} setDate={setToDate} className="rounded-r-none" />
                    <Input type="text" placeholder="23:59:59" value={toTime} onChange={(e) => handleTimeChange(e, setToTime)} maxLength={8} className="w-28 rounded-l-none" />
                </div>
                <div className='w-full max-w-[190px]'>
                  <Select>
                    <SelectTrigger id="period"><SelectValue placeholder={t('statistics.period')} /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">{t('statistics.today')}</SelectItem>
                        <SelectItem value="yesterday">{t('statistics.yesterday')}</SelectItem>
                        <SelectItem value="this_week">{t('statistics.thisWeek')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className='my-6' />

            <div className='space-y-4'>
                <div className="flex justify-between items-center">
                    <p className='text-sm'>{t('statistics.addFilterPrompt')}</p>
                     <Button variant="link" className="p-0 h-auto text-sm" onClick={() => setFilterDialogOpen(true)}>{t('statistics.addFilter')}</Button>
                </div>

                {filters.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-2">
                                <span>{filter.fieldLabel} {filter.operatorLabel} {filter.value}</span>
                                <button onClick={() => removeFilter(index)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className='flex justify-end'>
                <Button className="bg-green-600 hover:bg-green-700">{t('statistics.showReport')}</Button>
            </div>
          
            <Separator className='my-6' />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Input placeholder={t('statistics.templateNamePlaceholder')} className="w-auto" />
                <Button variant="link" className="p-0 h-auto text-sm">{t('statistics.createTemplate')}</Button>
              </div>
              <div className="flex items-center gap-2">
                <Label>{t('statistics.savedTemplates')}</Label>
                <Select defaultValue="borrador">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">{t('statistics.draft')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

        </CardContent>
      </Card>

      <Card className='mt-8'>
        <CardHeader className="space-y-4">
            <CardTitle>{t('statistics.title')}</CardTitle>
            <Button onClick={() => setUserDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-fit">
                {t('statistics.createUser')}
            </Button>
            <div className="flex justify-end">
                <div className="flex w-full max-w-sm">
                    <Input 
                        placeholder={t('statistics.searchPlaceholder')}
                        className="rounded-r-none focus-visible:ring-0" 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0 px-3" onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="rounded-l-none border-l-0 px-3" onClick={clearSearch}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <TableSkeleton columns={6} rows={itemsPerPage} />
          ) : (
            <StatisticsTable data={paginatedData} />
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
