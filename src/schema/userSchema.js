import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  integrations: {
    twitter: Boolean,
  },
});
