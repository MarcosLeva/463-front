
'use client';

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/components/i18n-provider";

// Metadata can't be in a client component, but we can export it from a server component if needed
// export const metadata: Metadata = {
//   title: "AdminView",
//   description: "Panel de gestión de usuarios",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // This effect should only run on the client after the initial mount
    if (isClient) {
      const currentAuthStatus = useAuthStore.getState().isAuthenticated;
      if (!currentAuthStatus && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [pathname, isClient, router]);


  const showLayout = pathname !== '/login';

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  // While waiting for the client to mount, we can render a loading state or nothing
  // to avoid hydration mismatches related to auth status.
  if (!isClient) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className="font-body antialiased" />
      </html>
    );
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>AdminView</title>
        <meta name="description" content="Panel de gestión de usuarios" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <I18nProvider>
          <ThemeProvider>
            {showLayout && isAuthenticated ? (
               <div className="flex flex-col min-h-screen w-full bg-background">
                  <Header isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                  <div className="flex flex-1">
                      <Sidebar isCollapsed={isSidebarCollapsed} />
                      <div className={cn(
                          "flex-1 transition-all duration-300",
                          isSidebarCollapsed ? "sm:pl-20" : "sm:pl-64"
                      )}>
                          {children}
                      </div>
                  </div>
              </div>
            ) : (
              <main>{children}</main>
            )}
            <Toaster />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
