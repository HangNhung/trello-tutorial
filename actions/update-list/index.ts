"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { UpdateListSchema } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, id } = data;
  let list;
  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      action: ACTION.UPDATE,
      entityId: list.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: list.title,
    });
  } catch (error) {
    return {
      error: "Failed to update list",
    };
  }
  revalidatePath(`board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateListSchema, handler);
