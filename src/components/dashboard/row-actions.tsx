
"use client";
import React from "react";
import { MoreHorizontal, Pencil, Printer, BarChart, History, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/types";
import { useTranslation } from "react-i18next";

interface RowActionsProps {
    user: User;
    onEdit: (user: User) => void;
    onBalanceAction: (user: User, action: 'deposit' | 'withdraw') => void;
}

export function RowActions({ user, onEdit, onBalanceAction }: RowActionsProps) {
  const { t } = useTranslation();
  const handleGenericAction = (actionName: string) => {
    console.log(`${actionName} for user ${user.id}`);
    // Here you would implement the logic for each action
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('rowActions.actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(user)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t('rowActions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Imprimir')}>
            <Printer className="mr-2 h-4 w-4" />
            {t('rowActions.print')}
          </DropdownMenuItem>
           <DropdownMenuItem className="cursor-pointer" onClick={() => onBalanceAction(user, 'deposit')}>
            <DollarSign className="mr-2 h-4 w-4" />
            {t('rowActions.changeBalance')}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Ver últimas transacciones')}>
            <BarChart className="mr-2 h-4 w-4" />
            {t('rowActions.viewLastTransactions')}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Historia')}>
            <History className="mr-2 h-4 w-4" />
            {t('rowActions.history')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleGenericAction('Eliminar')} className="cursor-pointer text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            {t('rowActions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
