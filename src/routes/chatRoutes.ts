import express from "express";
import {
  getChatList,
  getUserInfo,
  postQueryMessage,
  updateChatInfo,
} from "../controllers/chatController";

const ChatRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", getChatList);
ChatRouter.get("/user/info", getUserInfo);
ChatRouter.post("/chat", updateChatInfo);
ChatRouter.post("/chat/message", postQueryMessage);

export default ChatRouter;
