/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */


import { gql } from "apollo-server-micro";
import { Item } from "../models/Item";

export const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String!
    price: Float!
    status: String!
    stock: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ItemInput {
    name: String!
    description: String!
    price: Float!
    status: String
    stock: Int
  }

  type Query {
    getItems(search: String, page: Int, limit: Int): [Item]
    getItem(id: ID!): Item
    getItemsCount: Int
  }

  type Mutation {
    createItem(input: ItemInput!): Item
    updateItem(id: ID!, input: ItemInput!): Item
    deleteItem(id: ID!): String
  }
`;

export const resolvers = {
  Query: {
    async getItems(_: any, { search, page = 1, limit = 10 }: any) {
      const skip = (page - 1) * limit;
      let query = {};

      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
      }

      return await Item.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    },
    async getItem(_: any, { id }: any) {
      return await Item.findById(id);
    },
    async getItemsCount() {
      return await Item.countDocuments();
    },
  },
  Mutation: {
    async createItem(_: any, { input }: any) {
      const newItem = new Item(input);
      await newItem.save();
      return newItem;
    },
    async updateItem(_: any, { id, input }: any) {
      return await Item.findByIdAndUpdate(id, input, { new: true });
    },
    async deleteItem(_: any, { id }: any) {
      await Item.findByIdAndDelete(id);
      return "Item deleted successfully";
    },
  },
};

