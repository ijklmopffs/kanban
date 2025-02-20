import { useEffect, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/context/supbasecontext";
import { Button } from "./ui/button";
import addIcon from "@/assets/icons/icon-add-task-mobile.svg";

interface ColumnProps {
  boardId: string;
}

export default function Column({ boardId }: ColumnProps) {
  const { supabase } = useSupabase();
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    fetchColumns();
  }, [boardId]);

  const fetchColumns = async () => {
    const { data, error } = await supabase
      .from("boards")
      .select("columns")
      .eq("id", boardId)
      .single();
    if (error) {
      console.error("Error fetching columns:", error);
    } else {
      setColumns(data.columns);
    }
  };

  return (
    <div>
      <h1>Columns for Board {boardId}</h1>
      <div>
        {columns.length === 0 ? (
          <div className="mx-auto w-fit items-center flex flex-col h-4/5 justify-center">
            <p className="text-lighterBlue font-bold text-lg">
              This board is empty. Create a new column to get started.
            </p>
            <Button className="rounded-full bg-strongBlue p-2 mx-auto">
              <Image src={addIcon} alt="" />
              Add New Column
            </Button>
          </div>
        ) : (
          columns.map((column, index) => (
            <div key={index}>
              <h2>{column}</h2>
              {/* Add functionality to add tasks here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
