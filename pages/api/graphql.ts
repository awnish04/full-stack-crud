// pages / api / graphql.ts;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { ApolloServer } from "apollo-server-micro";
import { typeDefs, resolvers } from "../../lib/graphql/schema";
import dbConnect from "../../lib/db/connect";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse, IncomingMessage } from "http";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

export default async function handler(
  req: MicroRequest,
  res: ServerResponse<IncomingMessage>
) {
  await dbConnect();
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}
