import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BoardBody from "./components/BoardBody";
import { AppStateProvider } from "./context/AppStateContext";
import { TaskProvider } from "./context/TaskContext";
import TaskDetailsDialog from "./components/TaskDetailsDialog/TaskDetailsDialog";

const initialBoards = [
  { id: "1", name: "Platform Launch" },
  { id: "2", name: "Marketing Plan" },
  { id: "3", name: "Roadmap" },
];

const initialColumns = [];

function App() {
  const [boards, setBoards] = useState(initialBoards);
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  // Simulate navigation
  const handleSelectBoard = (id) => {
    setSelectedBoardId(id);
  };

  return (
    <TaskProvider>
      <div
        className={`flex h-screen w-screen bg-light-grey dark:bg-very-dark-grey font-plus-jakarta-sans`}
      >
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={handleSelectBoard}
          onCreateBoard={() => alert("Create new board")}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />
        <div className="flex-1 flex flex-col h-full bg-[var(--color-grey-light)] dark:bg-[var(--color-bg)] min-w-0 overflow-y-auto">
          <Header
            boardTitle={selectedBoard?.name || "Board"}
            onAddTask={() => alert("Add new task")}
          />
          <main className="flex-1 min-w-0">
            <BoardBody columns={columns} onAddColumn={() => alert("Add new column")} />
          </main>
        </div>
      </div>
      <TaskDetailsDialog />
    </TaskProvider>
  );
}

export default App;
