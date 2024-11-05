import express from "express";
import {
  getChatList,
  postQueryMessage,
  updateChatInfo,
  uploadQueryFilesMiddleware,
} from "../controllers/chatController";
import { authenticateToken } from "../controllers/authController";

const ChatRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", authenticateToken, getChatList);
ChatRouter.post("/chat", authenticateToken, updateChatInfo);
ChatRouter.post(
  "/chat/message",
  authenticateToken,
  uploadQueryFilesMiddleware,
  postQueryMessage
);

export default ChatRouter;
