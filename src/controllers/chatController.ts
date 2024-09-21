import { Request, Response } from "express";
import {
  getChatInfoMockData,
  getChatListMockData,
  getUserInfoMockData,
  postQueryMessageMockData,
} from "./mockdata";
import {
  GetChatListResponseModel,
  GetUserInfoResponseModel,
  UserInfoModel,
} from "../typings/chatTypings";

import db from "../database";
import { HTTPResponseErrorWrapper } from "../typings";

const DefaultUserAvatar = "src/assets/user-avatar-default.png";

// Example of getting users
export const getChatList = (
  req: Request,
  res: Response<GetChatListResponseModel>
) => {
  res.json(getChatListMockData);
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
  const chatInfo = await getChatInfoMockData(chatId);
  res.json(chatInfo);
};

export const postQueryMessage = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  const chatId = req.query.chatId as string;
  const message = req.query.message as string;
  const response = await postQueryMessageMockData(chatId, message);
  res.json(response);
};
