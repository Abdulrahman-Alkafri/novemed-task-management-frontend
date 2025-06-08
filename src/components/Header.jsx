import { Button } from "./ui/button";
import AddTaskDialog from "./AddTaskDialog";
import BoardMenu from "./BoardMenu";
import { useAppState } from "../context/AppStateContext";
import { useBoardColumns } from "../hooks/boardHooks";
import { useDeleteBoard } from "../hooks/useDeleteBoard";

export default function Header({
  boardTitle,
}) {
  const { selectedBoardId, sidebarOpen, boards, setBoards, setSelectedBoardId } = useAppState();
  const { data: columns, isLoading: isColumnsLoading } = useBoardColumns(selectedBoardId);
  const deleteBoardMutation = useDeleteBoard();

  const handleEditBoard = (data) => {
    if (!boards) return;
    const updatedBoards = boards.map(board => 
      board.id === selectedBoardId 
        ? { ...board, name: data.boardName }
        : board
    );
    setBoards(updatedBoards);
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoardMutation.mutateAsync(selectedBoardId);
      
      if (!boards) {
        throw new Error('Boards data is not available');
      }

      const updatedBoards = boards.filter(board => board.id !== selectedBoardId);
      setBoards(updatedBoards);
      
      // Select the first available board after deletion
      const nextBoardId = updatedBoards[0]?.id || null;
      setSelectedBoardId(nextBoardId);
    } catch (error) {
      console.error('Failed to delete board:', error);
      alert('Failed to delete board. Please try again.');
      throw error; // Re-throw to be caught by BoardMenu
    }
  };

  // Determine if the Add Task button should be disabled
  const isAddTaskDisabled = isColumnsLoading || !columns || columns?.length === 0;

  return (
    <header
      className="flex items-center justify-between px-8 py-6 border-b bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] border-[var(--color-info-light)] dark:border-[var(--color-info)]"
      style={{ minHeight: 80 }}
    >
      <div className="flex items-center gap-4">
        {!sidebarOpen && (
          <div className="p-2 w-full border-r">
            <img src="/path/to/your/logo.png" alt="Company Logo" className="h-8" />
          </div>
        )}
        <h1
          className="font-bold text-[var(--color-text)] dark:text-[var(--color-white)]"
          style={{ fontSize: "var(--heading-xl-size)" }}
        >
          {boardTitle}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <AddTaskDialog
          trigger={
            <Button
              className="rounded-full font-bold text-base px-6 py-3 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)] transition-colors"
              disabled={isAddTaskDisabled}
            >
              + Add New Task
            </Button>
          }
        />
        <BoardMenu 
          boardTitle={boardTitle}
          onEditBoard={handleEditBoard}
          onDeleteBoard={handleDeleteBoard}
        />
      </div>
    </header>
  );
}