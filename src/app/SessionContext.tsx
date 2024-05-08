"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Importação do useSession

// Importe o tipo Session diretamente de 'next-auth'
import { Session } from "next-auth";

type SessionContextType = Session | null;

const SessionCtxx = createContext<SessionContextType>(null);

export function useSessionContext() {
  return useContext(SessionCtxx);
}

export function SessionCtx({ children }: any) {
  const { data: session } = useSession();
  const [userSession, setUserSession] = useState(session);

  useEffect(() => {
    setUserSession(session);
  }, [session]);

  return (
    <SessionCtxx.Provider value={userSession}>{children}</SessionCtxx.Provider>
  );
}
