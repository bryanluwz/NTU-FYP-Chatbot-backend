import { Request, Response } from "express";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
  UserChatMessageModel,
} from "../typings/chatTypings";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { ChatUserTypeEnum } from "../typings/enums";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/Chat";
import { Persona } from "../models/Persona";
import { PersonaModel } from "../typings/dashboardTypings";
import { postQueryMessageApi, transferDocumentSrcApi } from "../apis";
import path from "path";
import fs from "fs";
import multer from "multer";

const databaseDocumentsStoragePath = path.resolve(
  process.cwd(),
  process.env.DOCUMENTS_STORAGE || "documents"
);
const databaseUploadsStoragePath = path.resolve(
  process.cwd(),
  process.env.UPLOADS_STORAGE || "uploads"
);

// Ensure the uploads directory exists
if (!fs.existsSync(databaseUploadsStoragePath)) {
  fs.mkdirSync(databaseUploadsStoragePath, { recursive: true });
}

// Example of getting users
export const getChatList = async (
  req: Request,
  res: Response<GetChatListResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;

  try {
    const chats = (await Chat.findAll({
      where: { userId },
      attributes: ["chatId", "chatName", "updatedAt"],
    })) as ChatListModel[];

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        chatList: chats,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chat list" });
  }
};

// Chat: Create, update, delete, get info
export const updateChatInfo = async (req: Request, res: Response) => {
  const action = req.body.action as string;
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
};

const createChat = async (
  req: Request,
  res: Response<GetMinimumChatInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const personaId = req.body.personaId as string;
  const userId = req.userId as string;

  try {
    const existingChat = await Chat.findOne({
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

    const persona = (await Persona.findByPk(personaId)) as PersonaModel;

    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    const chatName = persona.personaName;
    const chatId = uuidv4();

    const messages: ChatMessageModel[] = [
      {
        userType: ChatUserTypeEnum.AI,
        messageId: uuidv4(),
        message: `Hello! I am a Chatbot for ${persona.personaName}! \n${persona.personaDescription} \nHow can I help you today?`,
      },
    ];

    await Chat.create({
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
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const updateChat = async (
  req: Request,
  res: Response<GetMinimumChatInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const { chatName, chatId } = req.body.update as ChatInfoModel;

  try {
    const [updated] = await Chat.update(
      { chatName },
      {
        where: { chatId },
      }
    );

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
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update chat" });
  }
};

const deleteChat = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const chatId = req.body.chatId as string;

  try {
    const deleted = await Chat.destroy({
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
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to delete chat" });
  }
};

const getChatInfo = async (
  req: Request,
  res: Response<GetChatInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const chatId = req.body.chatId as string;
  try {
    const chat = (await Chat.findByPk(chatId)) as ChatInfoModel;
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chatMessages = chat.messages.map((message) => {
      try {
        const parsedMessage = JSON.parse(message.message);

        if ("text" in parsedMessage && "files" in parsedMessage) {
          const msg = parsedMessage as unknown as {
            text: string;
            files: { url: string; type: string; name?: string }[];
          };

          if (msg.files) {
            msg.files = parsedMessage.files.map(
              (file: { name: any; url: string }) => {
                const fileNameParts = (file.name ?? "").split("-");
                file.url = file.name;
                file.name = fileNameParts.slice(1).join("-");
                return file;
              }
            );
          }

          console.log(JSON.stringify(msg));

          return {
            messageId: message.messageId,
            userType: message.userType,
            message: JSON.stringify(msg),
          } as ChatMessageModel;
        } else {
          return message as ChatMessageModel;
        }
      } catch {
        return message as ChatMessageModel;
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
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chat info" });
  }
};

// Respond to user message
const upload = multer({
  limits: { fileSize: 128 * 1024 * 1024 }, // Limit file size to 128MB
});

export const uploadQueryFilesMiddleware = upload.array("files");

export const postQueryMessage = async (req: Request, res: Response) => {
  const userId = req.userId;

  const messageInfo = JSON.parse(req.body.messageInfo) as {
    chatId: string;
    message: string;
  };

  const chatId = messageInfo.chatId;

  try {
    const chat = (await Chat.findByPk(chatId)) as ChatInfoModel;

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    if (chat.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const chatHistory = chat.messages;

    const messageUnformatted = JSON.parse(
      messageInfo.message
    ) as ChatMessageModel;

    const files = (req.files as Express.Multer.File[]) ?? [];

    // Store files in databaseUploadsStoragePath
    const filePaths: { url: string; type: string; name?: string }[] = [];

    files.forEach((file: Express.Multer.File) => {
      const fileExt = file.originalname.split(".").pop();
      const uuidFilename =
        `${uuidv4().replace(/-/g, "")}-${file.originalname}` ||
        `no_name.${fileExt}`;
      const filePath = path.resolve(databaseUploadsStoragePath, uuidFilename);

      fs.writeFileSync(filePath, file.buffer);
      filePaths.push({
        url: filePath,
        type: file.mimetype,
        name: path.join("uploads", uuidFilename),
      });
    });

    const message: UserChatMessageModel = {
      messageId: messageUnformatted.messageId,
      userType: messageUnformatted.userType,
      message: {
        text: messageUnformatted.message,
        files: filePaths,
      },
    };

    let responseMessageResponse = await postQueryMessageApi({
      personaId: chat.personaId,
      message: {
        text: message.message.text,
        files: filePaths.map((file) => file.url),
      },
      chatHistory: chatHistory,
    });

    if (responseMessageResponse?.status?.code === 201) {
      console.log(
        "Failed to get reponse from AI server, since document is not found"
      );
      // Need to send over the document source
      try {
        // Get document source from persona
        const persona = await Persona.findByPk(chat.personaId);
        if (!persona) {
          return res.status(404).json({ error: "Persona not found" });
        }

        const documentSrcPath = persona.documentSrc;
        if (!documentSrcPath) {
          return res.status(404).json({ error: "Document source not found" });
        }

        const documentAbsPath = path.resolve(
          databaseDocumentsStoragePath,
          documentSrcPath
        );

        console.log("Document source path: ", documentAbsPath);

        const _response = await transferDocumentSrcApi({
          personaId: chat.personaId,
          documentSrcPath: documentAbsPath,
        });

        responseMessageResponse = await postQueryMessageApi({
          personaId: chat.personaId,
          message: {
            text: message.message.text,
            files: filePaths.map((file) => file.url),
          },
          chatHistory: chatHistory,
        });
      } catch (err: any) {
        console.error(err.message);
        return {
          status: {
            code: 200,
            message: "OK",
          },
          data: {
            message:
              "An error occured when transfering document source, please contact admin :0",
          },
        };
      }
    }

    const responseMessage = responseMessageResponse.data.response;

    // Store both user and AI message in database
    const messageModel: ChatMessageModel = {
      messageId: message.messageId,
      userType: message.userType,
      message: JSON.stringify({
        text: message.message.text,
        files: filePaths,
      }),
    };

    const responseMessageModel: ChatMessageModel = {
      messageId: Date.now().toString(),
      userType: ChatUserTypeEnum.AI,
      message: responseMessage,
    };

    const messages = chat.messages;
    messages.push(messageModel);
    messages.push(responseMessageModel);

    await Chat.update(
      { messages: messages, updatedAt: Date.now() },
      { where: { chatId } }
    );

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        message: responseMessageModel,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update chat info" });
  }
};
