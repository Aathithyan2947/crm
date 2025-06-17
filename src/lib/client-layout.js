'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Loader from '@/components/ui/loader';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { EmployeeProvider } from '@/context/employees-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20 * 60 * 1000, // 20 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <EmployeeProvider>
          <AuthGuard>{children}</AuthGuard>
          <Toaster position='top-center' reverseOrder={false} />
        </EmployeeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function AuthGuard({ children }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.prefetch('/dashboard/employees'); // Optional optimization
      } else {
        router.push('/auth/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <div className='min-h-screen w-screen flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  return <div className='min-h-screen w-screen'>{children}</div>;
}
