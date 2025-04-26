"use client";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ITEMS } from "@/lib/graphql/operations";
import ItemTable from "@/components/ItemTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ItemForm from "@/components/ItemForm";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_ITEMS, {
    fetchPolicy: "network-only",
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="container mx-auto py-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>Add New Item</Button>
            </DialogTrigger>
            <ItemForm
              onSuccess={() => {
                setDialogOpen(false);
                refetch();
              }}
            />
          </Dialog>
        </div>
        <ItemTable items={data.getItems} />
      </Card>
    </main>
  );
}
