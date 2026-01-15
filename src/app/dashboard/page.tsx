
'use client';

import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { Configurations } from "@/components/dashboard/configurations";
import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
       <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Home className="h-4 w-4" />
            /
            <span>{t('dashboard.usersBreadcrumb')}</span>
        </div>
      <Configurations />
      <UserDashboard />
    </main>
  );
}
