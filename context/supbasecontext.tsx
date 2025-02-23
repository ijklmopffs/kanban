"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client";

interface SupabaseContextType {
  supabase: SupabaseClient;
  boards: Board[];
  isBoardModalVisible: boolean;
  setBoardModalVisible: (isBoardModalVisible: boolean) => void;
  isTaskModalVisible: boolean;
  setTaskModalVisible: (isTaskModalVisible: boolean) => void;
  fetchBoards: () => Promise<void>;
}

interface Board {
  id: string;
  name: string;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isBoardModalVisible, setBoardModalVisible] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);

  const fetchBoards = async () => {
    const { data, error } = await supabase.from("boards").select("*");
    if (error) {
      console.error("Error fetching boards:", error);
    } else {
      setBoards(data as Board[]);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        boards,
        isBoardModalVisible,
        setBoardModalVisible,
        isTaskModalVisible,
        setTaskModalVisible,
        fetchBoards,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};
