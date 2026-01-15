
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { FilterCondition } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddFilter: (filter: FilterCondition) => void;
}

export function AddFilterDialog({ isOpen, onClose, onAddFilter }: Props) {
  const { t } = useTranslation();
  const [field, setField] = useState('deposit');
  const [operator, setOperator] = useState('greater_than');
  const [value, setValue] = useState('0');
  const [forRow, setForRow] = useState(false);
  const { toast } = useToast();

  const fieldOptions = [{ value: 'deposit', label: t('addFilterDialog.deposit') }];
  const operatorOptions = [
    { value: 'greater_than', label: '>' },
    { value: 'less_than', label: '<' },
    { value: 'equal_to', label: '=' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fieldLabel = fieldOptions.find(f => f.value === field)?.label || field;
    const operatorLabel = operatorOptions.find(o => o.value === operator)?.label || operator;

    onAddFilter({
      field,
      fieldLabel,
      operator,
      operatorLabel,
      value,
      forRow,
    });
    
    toast({
      title: t('addFilterDialog.successTitle'),
      description: t('addFilterDialog.successDesc', { fieldLabel, operatorLabel, value }),
    });

    onClose();
    // Reset state for next time
    setField('deposit');
    setOperator('greater_than');
    setValue('0');
    setForRow(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('addFilterDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('addFilterDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-2 flex-grow">
                    <Label htmlFor="filter-field">{t('addFilterDialog.condition')}</Label>
                    <Select value={field} onValueChange={setField}>
                        <SelectTrigger id="filter-field">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {fieldOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="filter-operator">{t('addFilterDialog.operator')}</Label>
                    <Select value={operator} onValueChange={setOperator}>
                        <SelectTrigger id="filter-operator">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {operatorOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="filter-value">{t('addFilterDialog.value')}</Label>
                    <Input
                        id="filter-value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="for-row"
                checked={forRow}
                onCheckedChange={(checked) => setForRow(!!checked)}
              />
              <Label htmlFor="for-row">{t('addFilterDialog.forRow')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('addFilterDialog.cancel')}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {t('addFilterDialog.addFilter')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
