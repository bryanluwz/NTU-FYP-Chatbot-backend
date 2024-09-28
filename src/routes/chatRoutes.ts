import express from "express";
import {
  getChatList,
  getUserInfo,
  postQueryMessage,
  updateChatInfo,
} from "../controllers/chatController";
import { authenticateToken } from "../controllers/authController";

const ChatRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", authenticateToken, getChatList);
ChatRouter.get("/user/info", authenticateToken, getUserInfo);
ChatRouter.post("/chat", authenticateToken, updateChatInfo);
ChatRouter.post("/chat/message", authenticateToken, postQueryMessage);

export default ChatRouter;
