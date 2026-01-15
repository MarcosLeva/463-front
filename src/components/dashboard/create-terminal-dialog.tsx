
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
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTerminalDialog({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [maxBalance, setMaxBalance] = useState("0.00");
  const [balance, setBalance] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPassword("");
      setMaxBalance("0.00");
      setBalance("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) {
      toast({
        title: t('createTerminalDialog.requiredFields'),
        description: t('createTerminalDialog.requiredFieldsDesc'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('createTerminalDialog.successTitle'),
      description: t('createTerminalDialog.successDesc', { name }),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('createTerminalDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('createTerminalDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('createTerminalDialog.name')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {t('createTerminalDialog.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-balance" className="text-right">
                {t('createTerminalDialog.maxBalance')}
              </Label>
              <Input
                id="max-balance"
                type="number"
                value={maxBalance}
                onChange={(e) => setMaxBalance(e.target.value)}
                className="col-span-3"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                {t('createTerminalDialog.balance')}
              </Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="col-span-3"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('createTerminalDialog.cancel')}
            </Button>
            <Button type="submit">{t('createTerminalDialog.create')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
