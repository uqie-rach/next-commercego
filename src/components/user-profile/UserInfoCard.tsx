"use client";

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { getSession } from "next-auth/react";

import { useUser } from "@/context/UserContext";
import { getUserNames } from "@/lib/user-utils";

export default function UserInfoCard() {
  const [loading, setLoading] = useState(true);
  const { user, saveUser } = useUser();

  useEffect(() => {
    fetchUser();
  }, [])

  async function fetchUser() {
    try {
      const session = await getSession();
      if (!session) return;

      if (!user?.profile || user?.profile === null) {
        console.log('[profile] from api')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${session?.user?.id}`);
        saveUser(response.data.user);
      }
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error("Error fetching user", error.message, error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const { firstName, middleName, lastName } = getUserNames(user?.name);

  return !loading && (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Middle Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {middleName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.profile?.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.profile?.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
