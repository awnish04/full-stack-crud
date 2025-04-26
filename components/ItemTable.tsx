"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import ItemForm from "./ItemForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useMutation } from "@apollo/client";
import { DELETE_ITEM, GET_ITEMS } from "../lib/graphql/operations";
import PaginationComponent from "./Pagination";

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ITEMS_PER_PAGE = 5;
export default function ItemTable({ items }: { items: Item[] }) {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteItem] = useMutation(DELETE_ITEM, {
    refetchQueries: [{ query: GET_ITEMS }],
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteItem({ variables: { id } });
      setOpenDeleteDialog(null); // Close the delete confirmation dialog
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Table for displaying items */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog
                  open={openDialogId === item.id}
                  onOpenChange={(open) =>
                    setOpenDialogId(open ? item.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <ItemForm
                    item={item}
                    onSuccess={() => setOpenDialogId(null)}
                  />
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => setOpenDeleteDialog(item.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!openDeleteDialog}
        onOpenChange={(open) => !open && setOpenDeleteDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {items.find((item) => item.id === openDeleteDialog)?.name}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(openDeleteDialog!)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
