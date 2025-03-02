"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authController_1 = require("../controllers/authController");
const ChatRouter = express_1.default.Router();
// Define routes related to chat (dont ask why the user info is here)
ChatRouter.get("/chat/list", authController_1.authenticateToken, chatController_1.getChatList);
ChatRouter.post("/chat", authController_1.authenticateToken, chatController_1.updateChatInfo);
ChatRouter.post("/chat/message", authController_1.authenticateToken, chatController_1.uploadQueryFilesMiddleware, chatController_1.postQueryMessage);
ChatRouter.post("/chat/message/tts", authController_1.authenticateToken, chatController_1.postQueryMessageTTS);
ChatRouter.post("/stt/audio", authController_1.authenticateToken, chatController_1.postSTTAudioMulterMiddleware, chatController_1.postSTTAudio); // url a bit out of place haha
ChatRouter.get("/chat/voices", authController_1.authenticateToken, chatController_1.getQueryVoices);
exports.default = ChatRouter;
