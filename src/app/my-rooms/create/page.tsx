'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
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
import Link from 'next/link';
import { Home, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

const currencies = ["AED","ALL","AMD","AOA","ARB","ARS","AUD","AZN","BAM","BDT","BGN","BHD","BIF","BLUCOIN","BOB","BRL","BTT","BWP","BYN","BYR","BZD","CAD","CDF","CHF","CLP","CNY","COP","CRC","CRE","CZK","DKK","DOP","DZD","EGP","ETB","EU","EUR","GBP","GC","GEL","GHS","GMD","GNF","GTQ","HNL","HRK","HTG","HUF","IDR","ILS","INR","IQD","IRN","IRR","IRT","ISK","JMD","JOD","JPY","KES","KGS","KIQD","KRW","KWD","KZT","LAK","LBP","LKR","LSL","LTC","LYD","MAD","MBCH","MBT","MDL","METH","MGA","MKD","mLTC","MMK","MNT","MXN","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PHP","PKR","PLN","PRB","PTS","PYG","QAR","RON","RSD","RUB","RWF","SAR","SC","SDG","SEK","SGD","SLE","SLL","SSP","STN","SYP","THB","TJS","TMT","TND","TRL","TRX","TRY","TZS","UAH","UBC","UGX","USD","USDT","UYU","UZS","VEF","VES","VEZ","VND","XAF","XOF","ZAR","ZMW"];
const integrationTypes = ["seamless", "individual"];

export default function CreateRoomPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hallName: '',
    currency: 'AED',
    integrationType: 'seamless'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, hallName: e.target.value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Basic validation for name
    if (formData.hallName.length < 5 || formData.hallName.length > 25) {
        toast({
            title: t('createRoom.validation.errorTitle'),
            description: t('createRoom.validation.length'),
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.hallName)) {
        toast({
            title: t('createRoom.validation.errorTitle'),
            description: t('createRoom.validation.characters'),
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    console.log('Creating room with data:', formData);
    toast({
      title: t('createRoom.success.title'),
      description: t('createRoom.success.description', { name: formData.hallName }),
    });

    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        setFormData({
            hallName: '',
            currency: 'AED',
            integrationType: 'seamless'
        });
    }, 1500);
  };


  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/my-rooms" className="hover:underline">{t('myRooms.breadcrumb')}</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{t('createRoom.breadcrumb')}</span>
      </div>
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle>{t('createRoom.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <Label htmlFor="hallName" className="md:text-right md:pt-2">{t('createRoom.hallName')}</Label>
                    <div className='md:col-span-2 space-y-2'>
                        <Input
                            id="hallName"
                            value={formData.hallName}
                            onChange={handleInputChange}
                            required
                        />
                        <CardDescription>
                            <p>{t('createRoom.validation.title')}:</p>
                            <ul className='list-disc pl-5 text-xs'>
                                <li>{t('createRoom.validation.length')}</li>
                                <li>{t('createRoom.validation.characters')}</li>
                                <li>{t('createRoom.validation.noSpaces')}</li>
                            </ul>
                        </CardDescription>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Label htmlFor="currency" className="md:text-right">{t('createRoom.currency')}</Label>
                    <div className="w-full max-w-xs">
                        <Select value={formData.currency} onValueChange={handleSelectChange('currency')}>
                            <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Label htmlFor="integrationType" className="md:text-right">{t('createRoom.integrationType')}</Label>
                     <div className="w-full max-w-xs">
                        <Select value={formData.integrationType} onValueChange={handleSelectChange('integrationType')}>
                            <SelectTrigger id="integrationType"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {integrationTypes.map(it => <SelectItem key={it} value={it}>{t(`createRoom.integrationTypes.${it}`)}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                 </div>

            </CardContent>
            <CardFooter className="mt-6 flex justify-end gap-2 border-t pt-6">
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? t('createRoom.creating') : t('createRoom.create')}
                </Button>
            </CardFooter>
        </form>
      </Card>
    </main>
  );
}
