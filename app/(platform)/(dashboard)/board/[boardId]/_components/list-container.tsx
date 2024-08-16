"use client";

import { useEffect, useState } from "react";
import { Droppable, DragDropContext } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List order updated successfully");
    },
    onError(error) {
      console.log(error);
    },
  });

  const { execute: executeCardListOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card order updated successfully");
    },
    onError(error) {
      console.log(error);
    },
  });

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination || !source || !type) return;

    // If dropper in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setOrderedData(items);
      executeUpdateListOrder({ boardId, items });
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exist on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reOrderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reOrderedCards;
        setOrderedData(newOrderedData);
        executeCardListOrder({ boardId, items: reOrderedCards });

        // User moves a card to another list
      } else {
        // Remove the card from the source list
        const [removedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the card
        removedCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, removedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for the each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        executeCardListOrder({ boardId, items: destinationList.cards });
      }
    }
  };

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="listId" type="list" direction="horizontal">
        {(provided: any) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full">
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
