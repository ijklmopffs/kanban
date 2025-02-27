import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/context/supbasecontext";
import { Button } from "./ui/button";
import addIcon from "@/assets/icons/icon-add-task-mobile.svg";
import Task from "./task";

interface ColumnProps {
  boardId: string;
}

interface Column {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  column_id: string;
}

export default function Column({ boardId }: ColumnProps) {
  const { supabase } = useSupabase();
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});

  const fetchTasks = useCallback(
    async (columns: Column[]) => {
      const tasksByColumn: { [key: string]: Task[] } = {};
      for (const column of columns) {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("column_id", column.id);
        if (error) {
          console.error(`Error fetching tasks for column ${column.id}:`, error);
        } else {
          tasksByColumn[column.id] = data;
        }
      }
      setTasks(tasksByColumn);
    },
    [supabase]
  );

  useEffect(() => {
    const fetchColumns = async () => {
      const { data, error } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", boardId);
      if (error) {
        console.error("Error fetching columns:", error);
      } else {
        setColumns(data);
        fetchTasks(data);
      }
    };

    fetchColumns();
  }, [boardId, supabase, fetchTasks]);

  const handleAddColumn = async () => {
    const columnName = prompt("Enter column name:");
    if (columnName) {
      const { data, error } = await supabase
        .from("columns")
        .insert([{ name: columnName, board_id: boardId }])
        .select();
      if (error) {
        console.error("Error adding column:", error);
      } else {
        setColumns([...columns, ...data]);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between p-4">
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
          columns.map((column) => (
            <div key={column.id} className="w-72">
              <h2 className="font-bold text-xs text-lighterBlue uppercase">
                {column.name}
              </h2>
              {tasks[column.id]?.map((task) => (
                <Task
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  // description={task.description}
                />
              ))}
            </div>
          ))
        )}
        <div
          className="flex items-center gap-2 bg-lightBlue w-72 justify-center h-[80vh] mt-10 cursor-pointer"
          onClick={handleAddColumn}
        >
          <Image src={addIcon} alt="" />
          <p className="font-bold text-2xl text-lighterBlue">New Column</p>
        </div>
      </div>
    </div>
  );
}
