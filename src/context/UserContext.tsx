"use client"

import { User } from "@/types/entities"
import { createContext, FC, useContext, useEffect, useState } from "react";

type UserContextType = {
  user: User | null;
  saveUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // check if user is logged in
    const user = localStorage.getItem('user');

    if (user) {
      setUser(JSON.parse(user));
    }
  }, [])


  const saveUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  return (
    <UserContext.Provider value={{ user, saveUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
