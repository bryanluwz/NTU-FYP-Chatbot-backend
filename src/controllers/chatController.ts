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

import db from "../database";
import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { UserTypeEnum } from "../typings/enums";
import { v4 as uuidv4 } from "uuid";
import { PersonaModel } from "../typings/dashboardTypings";

const DefaultUserAvatar = "src/assets/user-avatar-default.png";

// Example of getting users
export const getChatList = (
  req: Request,
  res: Response<GetChatListResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = "123" as string; // Hardcoded user ID for now

  db.all(
    "SELECT * FROM chats WHERE userId = ?",
    [userId],
    (err: { message: any }, rows: ChatListModel[]) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chat list" });
      }

      // Respond with the chat list from the database
      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          chatList: rows.map((row: any) => ({
            chatId: row.chatId,
            chatName: row.chatName,
            updatedAt: row.updatedAt,
          })),
        },
      });
    }
  );
};

export const getUserInfo = (
  req: Request,
  res: Response<GetUserInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = "123" as string; // Hardcoded user ID for now

  db.get(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err: { message: any }, row: UserInfoModel) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve user info" });
      }

      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      // Respond with the user info from the database
      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          userInfo: {
            id: row.id,
            username: row.username,
            email: row.email,
            avatar: DefaultUserAvatar, // Default avatar for now
          },
        },
      });
    }
  );
};

// Chat: Create, update, delete, get info
export const updateChatInfo = async (req: Request, res: Response) => {
  // If req.body.action is "create", create a new chat
  // If req.body.action is "update", update the chat
  // If req.body.action is "delete", delete the chat
  // If req.body.action is "get", get the chat info
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

  // Check if the persona exists as a chat by user
  db.get(
    "SELECT * FROM chats WHERE userId = ? AND personaId = ?",
    [userId, personaId],
    (err: { message: any }, row: ChatInfoModel) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Failed to check chat existence" });
      }

      if (row) {
        return res.json({
          status: {
            code: 200,
            message: "OK",
          },
          data: {
            chatInfo: {
              chatId: row.chatId,
              chatName: row.chatName,
            },
          },
        });
      }
    }
  );

  // Get chat name from the database table personas
  db.get(
    "SELECT * FROM personas WHERE personaId = ?",
    [personaId],
    (err: { message: any }, row: PersonaModel) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve persona" });
      }

      if (!row) {
        return res.status(404).json({ error: "Persona not found" });
      }

      const chatName = row.personaName;

      // Create a new chat in the database
      const chatId = uuidv4();

      const messages: ChatMessageModel[] = [
        {
          userType: UserTypeEnum.AI,
          messageId: uuidv4(),
          message: `Hello! I am a Chatbot for ${row.personaName}! \n${row.personaDescription}\n How can I help you today?`,
        },
      ];

      db.run(
        "INSERT INTO chats (chatId, userId, personaId, chatName, messages, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          chatId,
          userId,
          personaId,
          chatName,
          JSON.stringify(messages),
          Date.now(),
          Date.now(),
        ],
        (err: { message: any }) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Failed to create chat" });
          }

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
      );
    }
  );
};

const updateChat = async (
  req: Request,
  res: Response<GetMinimumChatInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const updateInfoModel = req.body.update as ChatInfoModel;

  db.run(
    "UPDATE chats SET chatName = ? WHERE chatId = ?",
    [updateInfoModel.chatName, updateInfoModel.chatId],
    (err: { message: any }) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update chat" });
      }

      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          chatInfo: {
            chatId: updateInfoModel.chatId,
            chatName: updateInfoModel.chatName,
          },
        },
      });
    }
  );
};

const deleteChat = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const chatId = req.body.chatId as string;

  db.run(
    "DELETE FROM chats WHERE chatId = ?",
    [chatId],
    (err: { message: any }) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to delete chat" });
      }

      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {},
      });
    }
  );
};

const getChatInfo = async (
  req: Request,
  res: Response<GetChatInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const chatId = req.body.chatId as string;

  db.get(
    "SELECT * FROM chats WHERE chatId = ?",
    [chatId],
    (err: { message: any }, row: ChatInfoModel) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chat info" });
      }

      if (!row) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Respond with the chat info from the database
      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          chatInfo: {
            chatId: row.chatId,
            chatName: row.chatName,
            messages: JSON.parse(row.messages as unknown as string),
            userId: row.userId,
            personaId: row.personaId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          },
        },
      });
    }
  );
};

// Respond to user message
export const postQueryMessage = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  const chatId = req.body.chatId as string;

  const message = req.body.message as ChatMessageModel;
  const responseMessage = getMockResponseMessage(); // This is where the message should be generated

  const messageModel: ChatMessageModel = message;
  const responseMessageModel: ChatMessageModel = {
    messageId: Date.now().toString(),
    userType: UserTypeEnum.AI,
    message: responseMessage,
  };

  // Put the message and response message into the database of chat
  db.get(
    "SELECT * FROM chats WHERE chatId = ?",
    [chatId],
    (err: { message: any }, row: ChatInfoModel) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chat info" });
      }

      if (!row) {
        return res.status(404).json({ error: "Chat not found" });
      }

      const messages = JSON.parse(
        row.messages as unknown as string
      ) as ChatMessageModel[];
      messages.push(messageModel);
      messages.push(responseMessageModel);

      db.run(
        "UPDATE chats SET messages = ? WHERE chatId = ?",
        [JSON.stringify(messages), chatId],
        (err: { message: any }) => {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .json({ error: "Failed to update chat info" });
          }

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
      );
    }
  );
};
