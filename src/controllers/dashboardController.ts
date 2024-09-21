import { Request, Response } from "express";
import { getAvailableChatsMockData } from "./mockdata";
import { GetAvailableChatsResponseModel } from "../typings/dashboardTypings";

// Example of getting users
export const getAvailableChats = (
  req: Request,
  res: Response<GetAvailableChatsResponseModel>
) => {
  res.json(getAvailableChatsMockData);
};
