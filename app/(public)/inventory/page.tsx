"use client";
import { useQuery } from "@apollo/client";
import { GET_ITEMS } from "@/lib/graphql/operations";
import ItemTableClient from "@/components/ItemTableClient";

export default function InventoryPage() {
  const { loading, error, data } = useQuery(GET_ITEMS, {
    fetchPolicy: "cache-first",
    onError: (err) => console.error("GraphQL Error:", err),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading inventory. Please try again later.</div>;
  if (!data?.getItems) return <div>No products found.</div>;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <ItemTableClient items={data.getItems} />
    </main>
  );
}
