"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text?: string;
  type: "submit" | "reset" | "button";
  variant: "primary" | "secondary" | "destructive";
}

export const FormButton = ({ text = "", ...props }: FormButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" disabled={pending} {...props}>
      {text}
    </Button>
  );
};
