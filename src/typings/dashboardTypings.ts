import { HTTPStatusBody } from "../typings";

export interface AvailableChatModel {
  chatId: string;
  chatName: string;
  chatDescription: string;
  chatAvatar?: string;
  createdAt: number; // timestamp epoch
  updatedAt: number;
}

export interface GetAvailableChatsResponseModel {
  status: HTTPStatusBody;
  data: {
    availableChats: AvailableChatModel[];
  };
}
