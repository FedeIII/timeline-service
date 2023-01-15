import express from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import typeDefs from "./src/type-defs/projects.js";
import resolvers from "./src/resolvers/index.js";
import twitterOauth from "./src/services/twitterOauth.js";
import me from "./src/services/me.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    (await import("./src/plugins/twitter/twitterPlugin.js")).default,
  ],
});

await server.start();

const corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://www.localhost:3000",
    "https://timeline-theta.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(
  "/graphql",
  cors(corsOptions),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      return { oauth2_token: req.cookies.oauth2_token };
    },
  })
);

await new Promise((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve)
);

app.get("/health", (req, res) => {
  res.status(200).send("Healthy");
});

app.get("/handshake", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      TWITTER_REDIRECT_URI: process.env.TWITTER_REDIRECT_URI,
      TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
      ME_URL: process.env.ME_URL,
      OAUTH_COOKIE: process.env.OAUTH_COOKIE,
    })
  );
});

app.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.send("<h1>Hello World</h1>");
});

app.get("/oauth/twitter", twitterOauth);

app.get("/me", me);
