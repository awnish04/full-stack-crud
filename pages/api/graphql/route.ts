// pages / api / graphql / route.ts;
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/lib/graphql/schema";
import dbConnect from "@/lib/db/connect";
import { NextRequest } from "next/server";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error("GraphQL Error:", error);
    return {
      message: error.message,
      code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
    };
  },
});

const handler = startServerAndCreateNextHandler(apolloServer);

export async function GET(request: NextRequest) {
  await dbConnect();
  return handler(request);
}

export async function POST(request: NextRequest) {
  await dbConnect();
  return handler(request);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
