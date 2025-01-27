import express from "express";
import {
  getChatList,
  postQueryMessage,
  postQueryMessageTTS,
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
ChatRouter.post("/chat/message/tts", authenticateToken, postQueryMessageTTS);

export default ChatRouter;
