import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema({
  message: { type: String, required: true },
  from: { type: String, enum: ["chatbot", "user"], default: "user" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

export const ChatBot = mongoose.model("ChatBot", chatBotSchema);
