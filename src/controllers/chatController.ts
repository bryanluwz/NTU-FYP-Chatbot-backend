import { Request, Response } from "express";
import {
  getChatListMockData,
  getUserInfoMockData,
} from "./chatControllerMockData";
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
