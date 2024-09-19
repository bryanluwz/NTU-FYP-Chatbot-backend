import express from "express";
import { getChatList, getUserInfo } from "../controllers/chatController";

const ChatRouter = express.Router();

// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", getChatList);
ChatRouter.get("/user/info", getUserInfo);

export default ChatRouter;
