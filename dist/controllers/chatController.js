"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryVoices = exports.postSTTAudio = exports.postSTTAudioMulterMiddleware = exports.postQueryMessageTTS = exports.postQueryMessage = exports.uploadQueryFilesMiddleware = exports.updateChatInfo = exports.getChatList = void 0;
const enums_1 = require("../typings/enums");
const uuid_1 = require("uuid");
const Chat_1 = require("../models/Chat");
const Persona_1 = require("../models/Persona");
const apis_1 = require("../apis");
const mime_types_1 = __importDefault(require("mime-types"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const databaseDocumentsStoragePath = path_1.default.resolve(process.cwd(), process.env.DOCUMENTS_STORAGE || "documents");
const databaseUploadsStoragePath = path_1.default.resolve(process.cwd(), process.env.UPLOADS_STORAGE || "uploads");
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(databaseUploadsStoragePath)) {
    fs_1.default.mkdirSync(databaseUploadsStoragePath, { recursive: true });
}
// Example of getting users
const getChatList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const chats = (yield Chat_1.Chat.findAll({
            where: { userId },
            attributes: ["chatId", "chatName", "updatedAt"],
        }));
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                chatList: chats,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chat list" });
    }
});
exports.getChatList = getChatList;
// Chat: Create, update, delete, get info
const updateChatInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const action = req.body.action;
    switch (action) {
        case "create":
            return createChat(req, res);
        case "update":
            return updateChat(req, res);
        case "delete":
            return deleteChat(req, res);
        case "get":
            return getChatInfo(req, res);
        default:
            return res.status(400).json({ error: "Invalid action" });
    }
});
exports.updateChatInfo = updateChatInfo;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const personaId = req.body.personaId;
    const userId = req.userId;
    try {
        const existingChat = yield Chat_1.Chat.findOne({
            where: { userId, personaId },
        });
        if (existingChat) {
            return res.json({
                status: {
                    code: 200,
                    message: "OK",
                },
                data: {
                    chatInfo: {
                        chatId: existingChat.chatId,
                        chatName: existingChat.chatName,
                    },
                },
            });
        }
        const persona = (yield Persona_1.Persona.findByPk(personaId));
        if (!persona) {
            return res.status(404).json({ error: "Persona not found" });
        }
        const chatName = persona.personaName;
        const chatId = (0, uuid_1.v4)();
        const messages = [
            {
                userType: enums_1.ChatUserTypeEnum.AI,
                messageId: (0, uuid_1.v4)(),
                message: `Hello! I am a Chatbot for ${persona.personaName}! \n${persona.personaDescription} \nHow can I help you today?`,
            },
        ];
        yield Chat_1.Chat.create({
            chatId,
            userId,
            personaId,
            chatName,
            messages: messages,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                chatInfo: {
                    chatId,
                    chatName,
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "An error occurred" });
    }
});
const updateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatName, chatId } = req.body.update;
    try {
        const [updated] = yield Chat_1.Chat.update({ chatName }, {
            where: { chatId },
        });
        if (updated) {
            return res.json({
                status: {
                    code: 200,
                    message: "OK",
                },
                data: {
                    chatInfo: {
                        chatId,
                        chatName,
                    },
                },
            });
        }
        return res.status(404).json({ error: "Chat not found" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update chat" });
    }
});
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.body.chatId;
    try {
        // Loop through all the messages and delete the files associated
        const chat = (yield Chat_1.Chat.findByPk(chatId));
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        const messages = chat.messages;
        for (const message of messages) {
            try {
                const parsedMessage = JSON.parse(message.message);
                if ("text" in parsedMessage && "files" in parsedMessage) {
                    const msg = parsedMessage;
                    if (msg.files) {
                        for (const file of msg.files) {
                            fs_1.default.unlinkSync(file.url);
                        }
                    }
                }
            }
            catch (_a) {
                // Do nothing
            }
        }
        const deleted = yield Chat_1.Chat.destroy({
            where: { chatId },
        });
        if (deleted) {
            return res.json({
                status: {
                    code: 200,
                    message: "OK",
                },
                data: {},
            });
        }
        return res.status(404).json({ error: "Chat not found" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to delete chat" });
    }
});
const getChatInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.body.chatId;
    try {
        const chat = (yield Chat_1.Chat.findByPk(chatId));
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        const chatMessages = chat.messages.map((message) => {
            try {
                const parsedMessage = JSON.parse(message.message);
                if ("text" in parsedMessage && "files" in parsedMessage) {
                    const msg = parsedMessage;
                    if (msg.files) {
                        msg.files = parsedMessage.files.map((file) => {
                            var _a;
                            const fileNameParts = ((_a = file.name) !== null && _a !== void 0 ? _a : "").split("-");
                            file.url = file.name;
                            file.name = fileNameParts.slice(1).join("-");
                            return file;
                        });
                    }
                    return {
                        messageId: message.messageId,
                        userType: message.userType,
                        message: JSON.stringify(msg),
                    };
                }
                else {
                    return message;
                }
            }
            catch (_a) {
                return message;
            }
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                chatInfo: {
                    chatId: chat.chatId,
                    chatName: chat.chatName,
                    messages: chatMessages,
                    userId: chat.userId,
                    personaId: chat.personaId,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt,
                },
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chat info" });
    }
});
// Respond to user message
const upload = (0, multer_1.default)({
    limits: { fileSize: 128 * 1024 * 1024 }, // Limit file size to 128MB
});
exports.uploadQueryFilesMiddleware = upload.array("files");
const postQueryMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.userId;
    const messageInfo = JSON.parse(req.body.messageInfo);
    const chatId = messageInfo.chatId;
    try {
        const chat = (yield Chat_1.Chat.findByPk(chatId));
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        if (chat.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const chatHistory = chat.messages;
        const messageUnformatted = JSON.parse(messageInfo.message);
        const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
        // Store files in databaseUploadsStoragePath
        const filePaths = [];
        for (const file of files) {
            const fileExt = file.originalname.split(".").pop();
            const uuidFilename = `${(0, uuid_1.v4)().replace(/-/g, "")}-${file.originalname}` ||
                `no_name.${fileExt}`;
            const filePath = path_1.default.resolve(databaseUploadsStoragePath, uuidFilename);
            fs_1.default.writeFileSync(filePath, file.buffer);
            filePaths.push({
                url: filePath,
                type: mime_types_1.default.lookup(file.originalname) || file.mimetype,
                name: path_1.default.join("uploads", uuidFilename),
            });
        }
        const message = {
            messageId: messageUnformatted.messageId,
            userType: messageUnformatted.userType,
            message: {
                text: messageUnformatted.message,
                files: filePaths,
            },
        };
        let responseMessageResponse = yield (0, apis_1.postQueryMessageApi)({
            personaId: chat.personaId,
            message: {
                text: message.message.text,
                files: filePaths.map((file) => file.url),
            },
            chatHistory: chatHistory,
        });
        if (((_b = responseMessageResponse === null || responseMessageResponse === void 0 ? void 0 : responseMessageResponse.status) === null || _b === void 0 ? void 0 : _b.code) === 201) {
            console.log("Failed to get reponse from AI server, since document is not found");
            // Need to send over the document source
            try {
                // Get document source from persona
                const persona = yield Persona_1.Persona.findByPk(chat.personaId);
                if (!persona) {
                    return res.status(404).json({ error: "Persona not found" });
                }
                const documentSrcPath = persona.documentSrc;
                if (!documentSrcPath) {
                    return res.json({
                        status: {
                            code: 200,
                            message: "OK",
                        },
                        data: {
                            message: {
                                messageId: Date.now().toString(),
                                userType: enums_1.ChatUserTypeEnum.AI,
                                message: "Ooopsies! A vital error has occured. Please restart the chat another time, or contact the administrator. ",
                            },
                        },
                    });
                }
                const documentAbsPath = path_1.default.resolve(databaseDocumentsStoragePath, documentSrcPath);
                // console.log("Document source path: ", documentAbsPath);
                const _response = yield (0, apis_1.transferDocumentSrcApi)({
                    personaId: chat.personaId,
                    documentSrcPath: documentAbsPath,
                });
                responseMessageResponse = yield (0, apis_1.postQueryMessageApi)({
                    personaId: chat.personaId,
                    message: {
                        text: message.message.text,
                        files: filePaths.map((file) => file.url),
                    },
                    chatHistory: chatHistory,
                });
            }
            catch (err) {
                console.error(err.message);
                return res.json({
                    status: {
                        code: 200,
                        message: "OK",
                    },
                    data: {
                        message: {
                            messageId: Date.now().toString(),
                            userType: enums_1.ChatUserTypeEnum.AI,
                            message: "Ooopsies! A vital error has occured. Please restart the chat another time, or contact the administrator. ",
                        },
                    },
                });
            }
        }
        const responseMessage = responseMessageResponse.data.response;
        const imagePaths = responseMessageResponse.data.image_paths;
        const savedImagePaths = [];
        // Get image and store in UPLOADS folder
        if (imagePaths) {
            for (const imagePath of imagePaths) {
                const imageBlob = yield (0, apis_1.postQueryImageApi)({
                    filename: imagePath,
                });
                const uuidFilename = `${(0, uuid_1.v4)()}.${imagePath.split(".").pop()}`;
                const filePath = path_1.default.resolve(databaseUploadsStoragePath, uuidFilename);
                const arrayBuffer = yield imageBlob.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fs_1.default.writeFileSync(filePath, buffer);
                savedImagePaths.push({
                    url: path_1.default.join("uploads", uuidFilename),
                    type: mime_types_1.default.lookup(imagePath) || "image/jpeg",
                    name: path_1.default.join("uploads", uuidFilename),
                });
            }
        }
        // Store both user and AI message in database
        const messageModel = {
            messageId: message.messageId,
            userType: message.userType,
            message: JSON.stringify({
                text: message.message.text,
                files: filePaths,
            }),
        };
        const responseMessageModel = {
            messageId: Date.now().toString(),
            userType: enums_1.ChatUserTypeEnum.AI,
            message: JSON.stringify({
                text: responseMessage,
                files: savedImagePaths,
            }),
        };
        const messages = chat.messages;
        messages.push(messageModel);
        messages.push(responseMessageModel);
        yield Chat_1.Chat.update({ messages: messages, updatedAt: Date.now() }, { where: { chatId } });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                message: responseMessageModel,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                message: {
                    messageId: Date.now().toString(),
                    userType: enums_1.ChatUserTypeEnum.AI,
                    message: "Ooopsies! A vital error has occured. Please restart the chat another time, or contact the administrator. ",
                },
            },
        });
    }
});
exports.postQueryMessage = postQueryMessage;
// Respond to TTS request, i.e. convert text to speech
const ttsFileStoragePath = path_1.default.resolve(process.cwd(), process.env.TTS_STORAGE || "tts");
const postQueryMessageTTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get ttsName from user + chatId + messageId from request
        let { ttsName, chatId, messageId } = req.body;
        if (!ttsName) {
            ttsName = "default";
        }
        if (!chatId) {
            return res.status(400).json({ error: "Chat ID invalid" });
        }
        if (!messageId) {
            return res.status(400).json({ error: "Message ID invalid" });
        }
        // See if tts file exists already
        const existingTtsFilePath = path_1.default.resolve(ttsFileStoragePath, `${messageId}-${ttsName}.mp3`);
        if (fs_1.default.existsSync(existingTtsFilePath)) {
            return res.json({
                status: {
                    code: 200,
                    message: "OK",
                },
                data: {
                    ttsFile: "tts/" + `${messageId}-${ttsName}.mp3`,
                },
            });
        }
        // Get message from chat
        const chat = (yield Chat_1.Chat.findByPk(chatId));
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        const message = chat.messages.find((msg) => msg.messageId === messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        let messageText = "";
        try {
            messageText = JSON.parse(message.message).text;
        }
        catch (err) {
            messageText = message.message;
        }
        // Call TTS API
        const ttsFilePath = path_1.default.resolve(ttsFileStoragePath, `${messageId}-${ttsName}.mp3`);
        const response = yield (0, apis_1.postQueryMessageTTSApi)({
            ttsName: ttsName,
            text: messageText,
            responseFileDownloadPath: ttsFilePath,
        });
        if (typeof response === "string" && response === ttsFilePath) {
            // Good to go
        }
        else if (((_a = response === null || response === void 0 ? void 0 : response.status) === null || _a === void 0 ? void 0 : _a.code) === 200) {
            throw new Error("Failed to get TTS function");
        }
        // Return the TTS file
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                ttsFile: "tts/" + `${messageId}-${ttsName}.mp3`,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to get TTS function" });
    }
});
exports.postQueryMessageTTS = postQueryMessageTTS;
exports.postSTTAudioMulterMiddleware = upload.single("audio");
const postSTTAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get audio blob from request formdata (audio)
    const audio = req.file;
    const audioBlob = audio.buffer;
    // Forward to AI server with API
    try {
        const blob = new Blob([audioBlob], { type: audio.mimetype });
        const response = yield (0, apis_1.postSTTAudioApi)({ audioBlob: blob });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                sttText: response.data.response,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to get STT function" });
    }
});
exports.postSTTAudio = postSTTAudio;
const getQueryVoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get voices from AI server
    try {
        const response = yield (0, apis_1.getQueryVoicesApi)();
        const voices = response.data.response;
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                response: voices,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to get voices" });
    }
});
exports.getQueryVoices = getQueryVoices;
