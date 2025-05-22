import express from "express";

import {
  createChatBotMessage,
  getChatBotMessage,
  getChatBotMessages,
  updateChatBotMessage,
  deleteChatBotMessage,
} from "../controllers/chatBotControllers.js";

let chatBotRoutes = express.Router();

chatBotRoutes.get("/", getChatBotMessages);
chatBotRoutes.get("/:id", getChatBotMessage);
chatBotRoutes.post("/", createChatBotMessage);
chatBotRoutes.put("/:id", updateChatBotMessage);
chatBotRoutes.delete("/:id", deleteChatBotMessage);

export { chatBotRoutes };
