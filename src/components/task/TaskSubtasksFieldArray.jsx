import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon, XIcon } from "lucide-react";

export default function TaskSubtasksFieldArray({ fields, append, remove, register, errors }) {
  return (
    <div>
      <label className="text-sm font-bold text-[var(--color-info)] dark:text-[var(--color-info-light)]">
        Subtasks (Optional)
      </label>
      <div className="flex flex-col gap-3 mt-1">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input 
              placeholder="e.g. Make coffee" 
              {...register(`subtasks.${index}.title`, {
                required: "Subtask title is required",
                minLength: {
                  value: 1,
                  message: "Subtask title cannot be empty"
                }
              })} 
              className="dark:text-[var(--color-white)] dark:placeholder-[var(--color-info-light)]"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => remove(index)} 
              className="text-[var(--color-info)] dark:text-[var(--color-info-light)] hover:text-[var(--color-accent)]"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
         {errors.subtasks?.root && (
          <p className="mt-1 text-sm text-red-500">{errors.subtasks.root.message}</p>
        )}
      </div>
      <Button 
        type="button" 
        variant="ghost" 
        onClick={() => append({ title: "", isCompleted: false })} 
        disabled={fields.length >= 10}
        className="mt-4 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]"
      >
        <PlusIcon className="mr-2 h-4 w-4"/> Add New Subtask
      </Button>
    </div>
  );
} 