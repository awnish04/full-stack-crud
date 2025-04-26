import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems {
    getItems {
      id
      name
      description
      price
    }
  }
`;

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    getItem(id: $id) {
      id
      name
      description
      price
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation CreateItem($input: ItemInput!) {
    createItem(input: $input) {
      id
      name
      description
      price
      status
      stock
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $input: ItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      name
      description
      price
      status
      stock
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

