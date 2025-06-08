import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";

export default function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  taskTitle,
  onConfirmDelete,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-[var(--color-bg-alt)] border-none">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-500">Delete this task?</DialogTitle>
          <DialogDescription className="text-[var(--color-info)] dark:text-[var(--color-info-light)]">
            Are you sure you want to delete the '{taskTitle}' task? This action will remove the task
            and its subtasks and cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="bg-[var(--color-surface)] text-[var(--color-text)] dark:bg-[var(--color-surface)] dark:text-[var(--color-white)] hover:bg-[var(--color-surface-alt)] dark:hover:bg-[var(--color-surface-alt)]"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            className="bg-[var(--color-accent)] text-[var(--color-white)] hover:bg-[var(--color-accent-light)] dark:hover:bg-[var(--color-accent-light)]"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 