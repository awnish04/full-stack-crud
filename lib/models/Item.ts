import { Schema, model } from "mongoose";

export interface IItem {
  name: string;
  description: string;
  price: number;
  status: string;
  stock: number;
}

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "active" },
  stock: { type: Number, default: 0 }
});

export const Item = model<IItem>("Item", itemSchema);





