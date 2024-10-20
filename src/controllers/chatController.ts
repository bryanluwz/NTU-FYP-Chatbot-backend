import { Request, Response } from "express";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
} from "../typings/chatTypings";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { ChatUserTypeEnum } from "../typings/enums";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/Chat";
import { Persona } from "../models/Persona";
import { PersonaModel } from "../typings/dashboardTypings";
import { postQueryMessageApi, transferDocumentSrcApi } from "../apis";
import path from "path";

const databaseDocumentsStoragePath = path.resolve(
  process.cwd(),
  process.env.DOCUMENTS_STORAGE || "documents"
);

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

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        chatInfo: {
          chatId: chat.chatId,
          chatName: chat.chatName,
          messages: chat.messages,
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
export const postQueryMessage = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  const chatId = req.body.chatId;
  const userId = req.userId;

  try {
    const chat = (await Chat.findByPk(chatId)) as ChatInfoModel;

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    if (chat.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const message = req.body.message as ChatMessageModel;

    let responseMessageResponse = await postQueryMessageApi({
      personaId: chat.personaId,
      message: message.message,
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

    responseMessageResponse = await postQueryMessageApi({
      personaId: chat.personaId,
      message: message.message,
    });

    const responseMessage = responseMessageResponse.data.response;
    // const responseMessage = "Coming soon";

    const messageModel: ChatMessageModel = message;
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
