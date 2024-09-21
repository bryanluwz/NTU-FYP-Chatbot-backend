import express from "express";
import {
  getChatInfo,
  getChatList,
  getUserInfo,
  postQueryMessage,
} from "../controllers/chatController";

const ChatRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", getChatList);
ChatRouter.get("/user/info", getUserInfo);
ChatRouter.get("/chat/", getChatInfo);
ChatRouter.post("/chat/", postQueryMessage);

export default ChatRouter;
