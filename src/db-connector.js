import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { environment } from "./app-config.js";
import { projectSchema } from "./schema/projectSchema.js";
import { tokenSchema } from "./schema/tokenSchema.js";

mongoose.Promise = Promise;

console.log("connecting to", process.env.MONGODB_URI, "...");
await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", () => {
  console.error("Error while connecting to DB");
});

console.log("connected!");

const Project = mongoose.model("Project", projectSchema);
const Token = mongoose.model("Token", tokenSchema);

export { Project, Token };
