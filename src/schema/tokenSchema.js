import mongoose from "mongoose";

export const tokenSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["TWITTER"],
  },
  value: String,
});
