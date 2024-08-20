"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteListSchema } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;
  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });

    await createAuditLog({
      action: ACTION.DELETE,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: list.title,
    });
  } catch (error) {
    return {
      error: "Failed to delete list",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteListSchema, handler);
