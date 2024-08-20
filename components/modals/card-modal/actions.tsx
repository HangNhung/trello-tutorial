import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopy, loading: isLoadingCopy } = useAction(copyCard, {
    onSuccess: () => {
      toast.success(`Card ${data.title} copied successfully`);
      cardModal.onClose();
    },
    onError(error) {
      toast.error(error);
    },
  });
  const { execute: executeDelete, loading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success(`Card ${data.title} deleted successfully`);
        cardModal.onClose();
      },
      onError(error) {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopy({
      id: data.id,
      boardId: boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDelete({
      id: data.id,
      boardId: boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        size="inline"
        variant="gray"
        className="w-full justify-start"
        disabled={isLoadingCopy}
        onClick={onCopy}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button
        size="inline"
        variant="gray"
        className="w-full justify-start"
        disabled={isLoadingDelete}
        onClick={onDelete}>
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeletion() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
