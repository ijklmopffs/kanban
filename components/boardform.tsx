import { useState } from "react";
import { Button } from "./ui/button";
import { useSupabase } from "@/context/supbasecontext";

export default function BoardForm() {
  const { supabase, setBoardModalVisible, fetchBoards } = useSupabase();
  const [name, setName] = useState("");
  const [columns, setColumns] = useState<string[]>([""]);

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

  const createNewBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Creating new board...");
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .insert([{ name }])
        .select()
        .single();
      if (boardError) {
        console.error("Error creating new board", boardError);
        return;
      }

      const boardId = boardData?.id;
      console.log("Board ID:", boardId);
      if (!boardId) {
        console.error("Invalid board ID");
        return;
      }

      const columnsData = columns.map((column) => ({
        name: column,
        board_id: boardId,
      }));

      const { error: columnsError } = await supabase
        .from("columns")
        .insert(columnsData);
      if (columnsError) {
        console.error("Error creating columns for new board", columnsError);
        return;
      }

      console.log("New board and columns created", boardData);
      await fetchBoards();
    } catch (error) {
      console.error("Unexpected error creating new board", error);
    }
    setBoardModalVisible(false);
  };

  return (
    <form onSubmit={createNewBoard}>
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
