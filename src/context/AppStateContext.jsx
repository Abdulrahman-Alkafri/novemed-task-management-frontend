import React, { createContext, useContext, useState, useEffect } from 'react';

const AppStateContext = createContext(undefined);

export const AppStateProvider = ({ children }) => {
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [columns, setColumns] = useState([]);
  const [boards, setBoards] = useState([]);

  // Theme effect
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSelectBoard = (id) => {
    setSelectedBoardId(id);
  };

  const onCreateBoard = (newBoardData) => {
    console.log("Creating new board with data:", newBoardData);
    // TODO: Implement board creation API call
  };

  return (
    <AppStateContext.Provider
      value={{
        selectedBoardId,
        sidebarOpen,
        theme,
        columns,
        boards,
        setSelectedBoardId,
        setSidebarOpen,
        setTheme,
        setColumns,
        setBoards,
        handleSelectBoard,
        onCreateBoard
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}; 