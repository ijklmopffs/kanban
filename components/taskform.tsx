import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "@/context/supbasecontext";

interface TaskFormProps {
  onSubmit: (title: string, description: string, columnId: string) => void;
  boardId: string | null;
}

interface Column {
  id: string;
  name: string;
}

export default function TaskForm({ onSubmit, boardId }: TaskFormProps) {
  const { supabase } = useSupabase();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([""]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

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
        if (data.length > 0) {
          setSelectedColumnId(data[0].id);
        }
      }
    };

    if (boardId) {
      fetchColumns();
    } else {
      console.error("Invalid board ID:", boardId);
    }
  }, [boardId, supabase]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          column_id: selectedColumnId,
        },
      ])
      .select();

    if (taskError) {
      console.error("Error creating task:", taskError);
    } else {
      console.log("Task created:", taskData);
      const taskId = taskData[0].id;

      const subtaskInserts = subtasks.map((subtask) => ({
        title: subtask,
        task_id: taskId,
      }));

      const { error: subtaskError } = await supabase
        .from("subtasks")
        .insert(subtaskInserts);

      if (subtaskError) {
        console.error("Error creating subtasks:", subtaskError);
      } else {
        console.log("Subtasks created");
        onSubmit(title, description, selectedColumnId);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4 text-darkGrey">Add New Task</h2>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-2 border border-lighterBlue/25 rounded-md text-darkGrey font-medium text-xs focus:outline-none"
          required
          placeholder="e.g. Take coffee break"
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">
          Description
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full pb-28 p-2 border border-lighterBlue/25 rounded-md text-darkGrey font-medium text-xs focus:outline-none"
          placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">
          Subtasks
        </label>
        {subtasks.map((subtask, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={subtask}
              onChange={(e) => handleSubtaskChange(index, e.target.value)}
              className="mt-1 block w-full p-2 border border-lighterBlue/25 rounded-md font-medium text-darkGrey text-xs focus:outline-none"
              placeholder="e.g. Make coffee"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveSubtask(index)}
              className="text-lighterBlue"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex mb-4 items-center justify-center flex-col gap-4">
        <Button
          type="button"
          onClick={handleAddSubtask}
          className="w-full rounded-full text-xs font-bold text-strongBlue bg-strongBlue/10"
        >
          + Add New Subtask
        </Button>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">
          Status
        </label>
        <select
          value={selectedColumnId}
          onChange={(e) => setSelectedColumnId(e.target.value)}
          className="mt-1 block w-full p-2 border border-lighterBlue/25 rounded-md text-darkGrey font-medium text-xs focus:outline-none capitalize"
          required
          title="subtask"
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id} className="capitalize">
              {column.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        className="w-full rounded-full text-xs font-bold text-white bg-strongBlue"
      >
        Create Task
      </Button>
    </form>
  );
}
