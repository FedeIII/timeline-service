import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import typeDefs from "./src/type-defs/projects.js";
import resolvers from "./src/resolvers/index.js";
import { PORT } from "./src/app-config.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    (await import("./src/plugins/twitter/twitter.js")).default,
  ],
});

await server.start();

app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

app.get("/health", (req, res) => {
  res.status(200).send("Healthy");
});
