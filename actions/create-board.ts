"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
});

export async function createBoard(preState: State, formData: FormData) {
  const validateFields = await CreateBoard.safeParse({
    title: formData.get("title"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing fields",
    };
  }

  const { title } = validateFields.data;

  try {
    await db.board.create({
      data: { title },
    });
  } catch (error) {
    return {
      message: "Data Error",
    };
  }

  revalidatePath("/organization/org_2kNuAlrcVy2AjTsC9gzZ1hSw8dC");
  redirect("/organization/org_2kNuAlrcVy2AjTsC9gzZ1hSw8dC");
}
