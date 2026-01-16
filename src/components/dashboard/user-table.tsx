
"use client";

import React, { useState, useMemo } from "react";
import type { HierarchyUser } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Printer, BarChart, History, Trash2, DollarSign, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserManagementDialog } from "./user-management-dialog";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";


interface UserTableProps {
  users: HierarchyUser[];
  toggleExpand: (userId: string) => void;
}

export function UserTable({ users, toggleExpand }: UserTableProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<HierarchyUser | null>(null);
  const [balanceAction, setBalanceAction] = useState<"deposit" | "withdraw" | null>(null);

  const handleBalanceAction = (user: HierarchyUser, action: "deposit" | "withdraw") => {
    setSelectedUserForBalance(user);
    setBalanceAction(action);
  };

  const handleEditAction = (user: HierarchyUser) => {
    // Assuming the edit page is still valid or needs adjustment
    router.push(`/users/${user.id}/edit`);
  };
  
  const closeBalanceDialog = () => {
    setSelectedUserForBalance(null);
    setBalanceAction(null);
  }

  const handleGenericAction = (actionName: string, userId: string) => {
    console.log(`${actionName} for user ${userId}`);
    // Here you would implement the logic for each action
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'USUARIO':
        return 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30';
      case 'SALA':
        return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  
  const columns = [
    { key: "name", label: t('userTable.name') },
    { key: "balance", label: t('userTable.balance') },
    { key: "createdUsersCount", label: t('userTable.createdUsers') },
    { key: "totalDeposits", label: t('userTable.totalDeposits') },
    { key: "totalWithdrawals", label: t('userTable.totalWithdrawals') },
    { key: "totalProfit", label: t('userTable.totalProfit') },
    { key: "avgRtp", label: t('userTable.avgRtp') },
  ];

  const getRowClass = (level: number) => {
    if (level === 0) return '';
    const levelClassMap: {[key: number]: string} = {
      1: 'bg-black/5 dark:bg-white/[.03]',
      2: 'bg-black/[.07] dark:bg-white/[.05]',
      3: 'bg-black/[.09] dark:bg-white/[.07]',
    }
    return levelClassMap[level] || 'bg-black/[.1] dark:bg-white/[.08]';
  }

  return (
    <>
      <UserManagementDialog
          isOpen={!!balanceAction}
          onClose={closeBalanceDialog}
          user={selectedUserForBalance ? { ...selectedUserForBalance, login: '', avatar: '', deposits: 0, withdrawals: 0, winnings: 0, game: '', createdAt: '' } : null}
          actionType={balanceAction}
      />

      <div className="space-y-4">
        <div className="w-full overflow-x-auto rounded-md border-none">
          <Table>
            <TableHeader className="bg-[#23303a]">
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-center"
                  >
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-center">{t('userTable.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className={getRowClass(user.level)}>
                    <TableCell style={{ paddingLeft: `${user.level * 1.5 + 1}rem` }}>
                       <div 
                        className={cn(
                          "flex items-center gap-2",
                          user.children && user.children.length > 0 && "cursor-pointer"
                        )}
                        onClick={() => user.children && user.children.length > 0 && toggleExpand(user.id)}
                      >
                        {user.children && user.children.length > 0 ? (
                           <ChevronRight className={cn("h-4 w-4 transition-transform", user.isExpanded && "rotate-90")} />
                        ) : (
                          <div className="w-4 h-4" /> // Placeholder for alignment
                        )}
                        <span className="font-medium">{user.name}</span>
                        <Badge variant="outline" className={cn("text-xs font-mono px-1.5 py-0", getTypeColor(user.type))}>
                          [{user.type}]
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {user.currency} {formatCurrency(user.balance)}
                    </TableCell>
                    <TableCell className="text-center">{user.createdUsersCount}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400 text-center">
                      {formatCurrency(user.totalDeposits)}
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400 text-center">
                       {formatCurrency(user.totalWithdrawals)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={user.totalProfit >= 0 ? "default" : "destructive"}
                        className={
                          user.totalProfit > 0
                            ? "bg-emerald-500/20 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/30"
                            : user.totalProfit < 0
                            ? "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30"
                            : ""
                        }
                      >
                        {formatCurrency(user.totalProfit)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.avgRtp.toFixed(2)}%</TableCell>
                    <TableCell className="text-center">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer mx-auto">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('rowActions.actions')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditAction(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {t('rowActions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Imprimir', user.id)}>
                              <Printer className="mr-2 h-4 w-4" />
                              {t('rowActions.print')}
                            </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer" onClick={() => handleBalanceAction(user, 'deposit')}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              {t('rowActions.changeBalance')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Ver últimas transacciones', user.id)}>
                              <BarChart className="mr-2 h-4 w-4" />
                              {t('rowActions.viewLastTransactions')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleGenericAction('Historia', user.id)}>
                              <History className="mr-2 h-4 w-4" />
                              {t('rowActions.history')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleGenericAction('Eliminar', user.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('rowActions.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    {t('userTable.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
