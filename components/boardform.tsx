import { useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "@/context/supbasecontext";

interface BoardFormProps {
  onSubmit: (name: string, columns: string[]) => void;
}

export default function BoardForm({ onSubmit }: BoardFormProps) {
  const { supabase } = useSupabase();
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewBoard();
    onSubmit(name, columns);
  };

  const handleAddColumn = () => {
    setColumns([...columns, ""]);
  };

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const createNewBoard = async () => {
    try {
      const { data, error } = await supabase.from("boards").insert([
        {
          name,
          columns,
        },
      ]);
      if (error) {
        console.error("Error creating new board", error);
        return;
      }
      console.log("New board created", data);
    } catch (error) {
      console.error("Unexpected error creating new board", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4 text-darkGrey">Add New Board</h2>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-lighterBlue rounded-md font-medium text-darkGrey text-sm focus:outline-none"
          placeholder="e.g. Web Design"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold text-lighterBlue">
          Columns
        </label>
        {columns.map((column, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={column}
              onChange={(e) => handleColumnChange(index, e.target.value)}
              className="mt-1 block w-full p-2 border border-lighterBlue rounded-md font-medium text-darkGrey text-sm focus:outline-none"
              placeholder="e.g. todo"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveColumn(index)}
              className="text-lighterBlue"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center flex-col gap-4">
        <Button
          type="button"
          onClick={handleAddColumn}
          className="w-full rounded-full text-xs font-bold text-strongBlue bg-strongBlue/10"
        >
          + Add New Column
        </Button>
        <Button
          type="submit"
          className="w-full rounded-full text-xs font-bold text-white bg-strongBlue"
        >
          Create New Board
        </Button>
      </div>
    </form>
  );
}
