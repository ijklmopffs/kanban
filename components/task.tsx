import { useSupabase } from "@/context/supbasecontext";
import { useEffect, useState } from "react";

interface TaskProps {
  id: string;
  title: string;
  // description: string;
}

interface Subtask {
  id: string;
  title: string;
  task_id: string;
  completed: boolean;
}

export default function Task({ id, title }: TaskProps) {
  const { supabase } = useSupabase();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSubtasks = async () => {
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .eq("task_id", id);
      if (error) {
        console.error("Error fetching subtasks:", error);
      } else {
        setSubtasks(data);
        setCompletedCount(data.filter((subtask) => subtask.completed).length);
        setTotalCount(data.length);
      }
    };

    fetchSubtasks();
  }, [id, supabase]);

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-7" id={id}>
      <h3 className="text-sm font-bold text-darkGrey">{title}</h3>
      <p className="text-xs text-lighterBlue mt-2">
        {completedCount} of {totalCount} subtasks
      </p>
    </div>
  );
}
