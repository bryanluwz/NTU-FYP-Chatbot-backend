import { Request, Response } from "express";
import { getMockResponseMessage } from "./mockdata";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  GetMinimumChatInfoResponseModel,
  GetUserInfoResponseModel,
  UserInfoModel,
} from "../typings/chatTypings";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { ChatUserTypeEnum } from "../typings/enums";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { Persona } from "../models/Persona";
import { PersonaModel } from "../typings/dashboardTypings";

const DefaultUserAvatar = "src/assets/user-avatar-default.png";

// Example of getting users
export const getChatList = async (
  req: Request,
  res: Response<GetChatListResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = "123"; // Hardcoded user ID for now

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

export const getUserInfo = async (
  req: Request,
  res: Response<GetUserInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = "123"; // Hardcoded user ID for now

  try {
    const user = (await User.findByPk(userId)) as UserInfoModel;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        userInfo: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: DefaultUserAvatar, // Default avatar for now
        },
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve user info" });
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
  const userId = req.body.userId as string;

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
      messages: JSON.stringify(messages),
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
          messages: JSON.parse(chat.messages as unknown as string),
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
  const chatId = req.body.chatId as string;

  const message = req.body.message as ChatMessageModel;
  const responseMessage = getMockResponseMessage(); // This is where the message should be generated

  const messageModel: ChatMessageModel = message;
  const responseMessageModel: ChatMessageModel = {
    messageId: Date.now().toString(),
    userType: ChatUserTypeEnum.AI,
    message: responseMessage,
  };

  try {
    const chat = (await Chat.findByPk(chatId)) as ChatInfoModel;

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const messages = JSON.parse(
      chat.messages as unknown as string
    ) as ChatMessageModel[];
    messages.push(messageModel);
    messages.push(responseMessageModel);

    await Chat.update(
      { messages: JSON.stringify(messages), updatedAt: Date.now() },
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
