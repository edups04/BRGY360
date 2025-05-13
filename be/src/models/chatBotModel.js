import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema({
  message: { type: String, required: true },
  from: { enum: ["chatbot", "user"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
});

export const ChatBot = mongoose.model("ChatBot", chatBotSchema);
