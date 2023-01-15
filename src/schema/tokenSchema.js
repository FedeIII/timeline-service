import mongoose from "mongoose";

export const tokenSchema = new mongoose.Schema({
  userId: String,
  type: {
    type: String,
    enum: ["TWITTER"],
  },
  value: String,
});
