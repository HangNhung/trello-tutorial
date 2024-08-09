"use client";

import { createBoard } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";

export const Form = () => {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createBoard, initialState);

  return (
    <form action={dispatch}>
      <div className="flex flex-col gap-y-2">
        <FormInput errors={state?.errors} />
        <FormButton variant="primary" text="Submit" type="submit" />
      </div>
    </form>
  );
};
