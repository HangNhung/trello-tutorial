"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteBoard(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  });

  revalidatePath("/organization/org_2kNuAlrcVy2AjTsC9gzZ1hSw8dC");
  redirect("/organization/org_2kNuAlrcVy2AjTsC9gzZ1hSw8dC");
}
