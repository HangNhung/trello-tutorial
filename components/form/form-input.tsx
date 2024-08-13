"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormErrors } from "./form-error";

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  // value?: string;
  errors?: Record<string, string[] | undefined>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  // onChange?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      errors,
      required,
      disabled,
      className,
      defaultValue = "",
      onBlur,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-2">
          {label && (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700">
              {label}
            </Label>
          )}
          <Input
            onBlur={onBlur}
            ref={ref}
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            disabled={pending || disabled}
            required={required}
            className={cn("tsxt-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors errors={errors} id={id} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
