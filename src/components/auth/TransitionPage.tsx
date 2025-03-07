'use client';

import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react'

import { useUser } from '@/context/UserContext';

const TransitionPage = ({ userData }: { userData: Session | null }) => {
  const { user, saveUser } = useUser();

  async function getClientSideSession() {
    const session = await getSession();

    if (session) {
      saveUser({
        id: session?.user?.id ?? null,
        name: session?.user?.name ?? null,
        email: session?.user?.email ?? null,
        image: session?.user?.image ?? null,
        profile: null,
        role: session?.user?.role === 'admin' || session?.user?.role === 'member' ? session?.user?.role : null
      });
    }
  }

  useEffect(() => {
    getClientSideSession();
  }, [])

  useEffect(() => {
    if (user !== null) {
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;
      }, 2500);
    }
  }, [userData, user, saveUser])


  return (
    <div className='mx-auto'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Welcome {userData?.user?.name}
      </h1>
      <p className='text-lg text-brand-600 bg-brand-200 px-6 w-fit mx-auto py-2 rounded-lg text-center mb-4'>
        You have successfully logged in
      </p>

      <p className='text-lg text-gray-600 text-center'>
        You will be redirected to the dashboard in a few seconds...
      </p>
    </div>
  )
}

export default TransitionPage;
