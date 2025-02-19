"use client";

import { createContext, ReactNode, useContext } from "react";
import { supabase } from "@/supabase/client";

const SupabaseContext = createContext(null);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
