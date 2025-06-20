'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/ui/loader';
import { AUTH_ROUTE, DASHBOARD_ROUTES } from '@/helpers/enums';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const destination = token ? DASHBOARD_ROUTES.EMPLOYEES : AUTH_ROUTE.LOGIN;
      router.replace(destination);
    }
  }, [token, isLoading, router]);

  return (
    <>
      <Head>
        <title>Flaer CRM</title>
        <meta name='description' content='Redirecting to your workspace...' />
      </Head>

      <div className='h-screen w-screen flex items-center justify-center'>
        <Loader />
      </div>
    </>
  );
}
