'use client';

import { useUser } from '@/context/UserContext';
import React, { useEffect } from 'react'

const TransitionPage = ({ userData }) => {
  const { user, saveUser } = useUser();

  useEffect(() => {
    if (user === null) {
      saveUser(userData);
    }

    if (user !== null) {
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    }
  }, [userData, user, saveUser])


  return (
    <div className='mx-auto'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
        Welcome {userData?.name}
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
