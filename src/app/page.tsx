'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      <p>Redirigiendo...</p>
    </main>
  );
}
