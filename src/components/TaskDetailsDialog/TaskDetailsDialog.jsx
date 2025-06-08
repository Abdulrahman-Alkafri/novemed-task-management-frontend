import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";
import { useTask } from "../../context/TaskContext";
import { createPortal } from 'react-dom';
import { useTaskDetails, useBoardColumns, useToggleSubtask, useDeleteTask } from "../../hooks/taskHooks";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskDetailsDialog() {
  const { selectedTaskId, isTaskDetailsDialogOpen, closeTaskDetailsDialog } = useTask();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: task, isLoading: isTaskLoading, error: taskError } = useTaskDetails(selectedTaskId, isTaskDetailsDialogOpen);
  const { data: columns = [], isLoading: isColumnsLoading } = useBoardColumns(task?.boardId);
  const toggleSubtaskMutation = useToggleSubtask(selectedTaskId);
  const deleteTaskMutation = useDeleteTask(closeTaskDetailsDialog);

  const handleToggleSubtaskCompletion = (subtaskId, currentCompletionStatus, subtaskTitle) => {
    if (selectedTaskId) {
      toggleSubtaskMutation.mutate({ subtaskId, isCompleted: !currentCompletionStatus, title: subtaskTitle });
    }
  };

  const handleDeleteTask = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    if (selectedTaskId) {
      deleteTaskMutation.mutate(selectedTaskId);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditTask = () => {
    setIsEditDialogOpen(true);
  };

  const handleTaskUpdated = () => {
    queryClient.invalidateQueries(["taskDetails", selectedTaskId]);
    queryClient.invalidateQueries(["boardColumns"]);
    setIsEditDialogOpen(false);
  };

  if (!isTaskDetailsDialogOpen) return null;

  if (isTaskLoading || isColumnsLoading) {
    return createPortal(
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-white dark:bg-[var(--color-dark-grey-dark)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Loading task details...
          </div>
        </DialogContent>
      </Dialog>,
      document.body
    );
  }

  if (taskError) {
    return createPortal(
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg">
          <div className="p-6 text-center text-red-500">
            Error: {taskError.message}
          </div>
        </DialogContent>
      </Dialog>,
      document.body
    );
  }

  if (!task) return createPortal(null, document.body);

  return createPortal(
    <>
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={closeTaskDetailsDialog}>
        <DialogContent className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-alt)] p-6 rounded-lg shadow-lg max-w-md w-full" showCloseButton={false}>
          <DialogHeader className="flex flex-row justify-between items-center mb-6">
            <DialogTitle className="text-xl font-bold text-[var(--color-text)] dark:text-[var(--color-white)]">
              {task.title}
            </DialogTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]">
                  <MoreVertical className="h-4 w-4 text-[var(--color-info)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-[var(--color-dark-grey-dark)] border border-[var(--color-lines-dark)]">
                <DropdownMenuItem 
                  onClick={handleEditTask} 
                  className="text-[var(--color-text)] dark:text-[var(--color-white)] hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteTask} 
                  className="text-red-500 hover:text-red-600 hover:bg-[var(--color-lines-dark)] dark:hover:bg-[var(--color-lines-dark)]"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogHeader>

          <DialogDescription className="text-[var(--color-info-light)] mb-6 text-sm font-medium leading-6">
            {task.description}
          </DialogDescription>

          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-[var(--color-info-light)] mb-4">
              Subtasks ({task.subtasks.filter(subtask => subtask.isCompleted).length} of {task.subtasks.length})
            </h3>
            <div className="space-y-3">
              {task.subtasks.map((subtask) => (
                <div 
                  key={subtask.id} 
                  className="flex items-center space-x-3 p-3 bg-[var(--color-bg-alt)] dark:bg-[var(--color-bg)] rounded-lg cursor-pointer"
                  onClick={() => handleToggleSubtaskCompletion(subtask.id, subtask.isCompleted, subtask.title)}
                >
                  <input
                    type="checkbox"
                    id={`subtask-${subtask.id}`}
                    checked={subtask.isCompleted}
                    onChange={() => {}}
                    className="w-5 h-5 border-[var(--color-lines-dark)] rounded focus:ring-0 focus:ring-offset-0 accent-[var(--color-primary)]"
                  />
                  <label
                    htmlFor={`subtask-${subtask.id}`}
                    className={`text-sm font-medium leading-none cursor-pointer ${
                      subtask.isCompleted 
                        ? "line-through text-[var(--color-info-light)]" 
                        : "text-[var(--color-text)] dark:text-[var(--color-white)]"
                    }`}
                  >
                    {subtask.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-[var(--color-info-light)] mb-4">
              Current Status
            </h3>
            <p className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-white)] capitalize">
              {task.columnName || "Loading..."}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskTitle={task?.title}
        onConfirmDelete={handleConfirmDeleteTask}
      />

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        taskId={selectedTaskId}
        onTaskUpdated={handleTaskUpdated}
        trigger={<></>}
      />
    </>,
    document.body
  );
} 