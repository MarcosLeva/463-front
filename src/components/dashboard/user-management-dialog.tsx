
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User, HierarchyUser } from "@/lib/types";
import { useTranslation } from "react-i18next";

// This component can now accept either type, but will primarily use name and balance.
type DialogUser = (User | HierarchyUser) & { balance: number; name: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: DialogUser | null;
  actionType: "deposit" | "withdraw" | null;
}

export function UserManagementDialog({
  isOpen,
  onClose,
  user,
  actionType,
}: Props) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
    }
  }, [isOpen]);

  if (!user || !actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: t('userManagementDialog.invalidAmount'),
        description: t('userManagementDialog.invalidAmountDesc'),
        variant: "destructive",
      });
      return;
    }

    if (actionType === "withdraw" && numAmount > user.balance) {
      toast({
        title: t('userManagementDialog.insufficientFunds'),
        description: t('userManagementDialog.insufficientFundsDesc', { balance: user.balance.toFixed(2) }),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('userManagementDialog.successTitle'),
      description: t('userManagementDialog.successDesc', { actionType: actionType === "deposit" ? t('userManagementDialog.deposit') : t('userManagementDialog.withdraw'), amount: numAmount.toFixed(2), name: user.name }),
    });

    onClose();
  };

  const title =
    actionType === "deposit" ? t('userManagementDialog.depositTitle') : t('userManagementDialog.withdrawTitle');
  const description = t('userManagementDialog.description', {
    action: actionType === "deposit" ? t('userManagementDialog.deposit') : t('userManagementDialog.withdraw'),
    name: user.name,
    balance: user.balance.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
  });
  const confirmAction = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                {t('userManagementDialog.amount')}
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('userManagementDialog.cancel')}
            </Button>
            <Button type="submit">
              {t('userManagementDialog.confirm', { action: confirmAction })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
