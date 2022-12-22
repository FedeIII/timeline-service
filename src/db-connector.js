import mongoose from "mongoose";
import { environment } from "./app-config.js";
import { projectSchema } from "./schema/projectSchema.js";
import { tokenSchema } from "./schema/tokenSchema.js";

const env = process.env.NODE_ENV || "development";
// const env = "production";

mongoose.Promise = Promise;

console.log("connecting to", environment[env].dbString, "...");
await mongoose.connect(environment[env].dbString, {
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
