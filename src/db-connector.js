import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { projectSchema } from "./schema/projectSchema.js";
import { tokenSchema } from "./schema/tokenSchema.js";
import { userSchema } from "./schema/userSchema.js";

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
const User = mongoose.model("User", userSchema);

export { Project, Token, User };
