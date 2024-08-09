import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { FormButton } from "./form-button";

interface BoardProps {
  id: string;
  title: string;
}

export const Board = ({ title, id }: BoardProps) => {
  const deleteBoardWithId = deleteBoard.bind(null, id);

  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board title {title}</p>
      <FormButton type="submit" variant="destructive" text="Delete" />
    </form>
  );
};
