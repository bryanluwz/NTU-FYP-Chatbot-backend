import { Request, Response } from "express";
import {
  getChatInfoMockData,
  getChatListMockData,
  getMockResponseMessage,
  getUserInfoMockData,
  postQueryMessageMockData,
} from "./mockdata";
import {
  ChatInfoModel,
  ChatListModel,
  ChatMessageModel,
  GetChatListResponseModel,
  GetUserInfoResponseModel,
  UserInfoModel,
} from "../typings/chatTypings";

import db from "../database";
import { HTTPResponseErrorWrapper } from "../typings";
import { UserTypeEnum } from "../typings/enums";

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

export const getChatInfo = async (req: Request, res: Response) => {
  const chatId = req.query.chatId as string;

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
          },
        },
      });
    }
  );
};

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
