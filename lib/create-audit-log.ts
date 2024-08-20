import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

interface Props {
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
}

export const createAuditLog = async ({
  action,
  entityId,
  entityType,
  entityTitle,
}: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("User not found");
    }

    await db.auditLog.create({
      data: {
        orgId,
        action,
        entityId: entityId,
        entityType,
        entityTitle,
        userId: user.id,
        userImage: user.imageUrl,
        userName: user.firstName + " " + user.lastName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
