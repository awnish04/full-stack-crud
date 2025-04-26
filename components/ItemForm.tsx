/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useMutation } from "@apollo/client";
import {
  CREATE_ITEM,
  UPDATE_ITEM,
  GET_ITEMS,
} from "../lib/graphql/operations";
import { toast } from "sonner";

interface ItemFormProps {
  item?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  onSuccess?: () => void;
}

export default function ItemForm({ item, onSuccess }: ItemFormProps) {
  const [createItem] = useMutation(CREATE_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: item || {
      name: "",
      description: "",
      price: 0,
    },
  });
  

  const onSubmit = async (data: any) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        status: "active", // Add default status
        stock: 0, // Add default stock
      };

      if (item) {
        await updateItem({
          variables: {
            id: item.id,
            input,
          },
          refetchQueries: [{ query: GET_ITEMS }],
        });
        toast.success("Item updated successfully");
      } else {
        await createItem({
          variables: { input },
          refetchQueries: [{ query: GET_ITEMS }],
        });
        toast.success("Item created successfully");
      }

      reset();
      setTimeout(() => onSuccess?.(), 200);
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    }
  };
  

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{item ? "Edit Item" : "Create New Item"}</DialogTitle>
        <DialogDescription>
          {item
            ? "Update the item details"
            : "Add a new item to your inventory"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              {...register("name", { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              className="col-span-3"
              {...register("description", { required: true })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              className="col-span-3"
              {...register("price", {
                required: true,
                valueAsNumber: true,
                min: 0,
              })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
      
    </DialogContent>
  );
}
