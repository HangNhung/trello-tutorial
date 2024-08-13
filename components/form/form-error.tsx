import { XCircle } from "lucide-react";

interface FormErrorProps {
  errors?: Record<string, string[] | undefined>;
  id: string;
}

export const FormErrors = ({ errors, id }: FormErrorProps) => {
  if (!errors || !errors[id]) return null;

  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-rose-500">
      {errors[id]?.map((error) => (
        <div
          key={error}
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10">
          <XCircle className="mr-2 h-4 w-4" />
          {error}
        </div>
      ))}
    </div>
  );
};
