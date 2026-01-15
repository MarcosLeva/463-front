
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserDialog({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [initialBalance, setInitialBalance] = useState("");
  const [roleKey, setRoleKey] = useState("USER");
  const [parentId, setParentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setUsername("");
      setFullName("");
      setEmail("");
      setPassword("");
      setCurrency("ARS");
      setInitialBalance("");
      setRoleKey("USER");
      // Set parentId to the logged-in user's ID by default
      setParentId(user?.id || "");
      setIsLoading(false);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !fullName || !password || !email || !parentId) {
      toast({
        title: t('createUserDialog.requiredFields'),
        description: t('createUserDialog.requiredFieldsDesc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      username,
      fullName,
      email,
      password,
      currency,
      initialBalance: parseFloat(initialBalance) || 0,
      roleKey,
      parentId,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al crear el usuario');
      }

      toast({
        title: t('createUserDialog.successTitle'),
        description: t('createUserDialog.successDesc', { name: fullName }),
      });

      onClose();

    } catch (error: any) {
      toast({
        title: t('createUserDialog.errorTitle'),
        description: error.message || t('createUserDialog.errorApi'),
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('createUserDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('createUserDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
             <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                {t('createUserDialog.username')}
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-2"
                required
                disabled={isLoading}
              />
            </div>
             <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                {t('createUserDialog.fullName')}
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="col-span-2"
                required
                disabled={isLoading}
              />
            </div>
             <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('createUserDialog.email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-2"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {t('createUserDialog.password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-2"
                required
                disabled={isLoading}
              />
            </div>
             <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="roleKey" className="text-right">
                {t('createUserDialog.role')}
              </Label>
              <Select value={roleKey} onValueChange={setRoleKey} disabled={isLoading}>
                <SelectTrigger id="roleKey" className="col-span-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">{t('createUserDialog.userRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                {t('createUserDialog.currency')}
              </Label>
              <Select value={currency} onValueChange={setCurrency} disabled={isLoading}>
                <SelectTrigger id="currency" className="col-span-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="UYU">UYU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="initialBalance" className="text-right">
                {t('createUserDialog.initialBalance')}
              </Label>
              <Input
                id="initialBalance"
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="col-span-2"
                placeholder="0.00"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t('createUserDialog.cancel')}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('createUserDialog.creating') : t('createUserDialog.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
