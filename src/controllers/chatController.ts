import { Request, Response } from "express";
import {
  getChatInfoMockData,
  getChatListMockData,
  getUserInfoMockData,
  postQueryMessageMockData,
} from "./mockdata";
import { GetChatListResponseModel } from "../typings/chatTypings";

// Example of getting users
export const getChatList = (
  req: Request,
  res: Response<GetChatListResponseModel>
) => {
  res.json(getChatListMockData);
};

export const getUserInfo = (req: Request, res: Response) => {
  res.json(getUserInfoMockData);
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
