import { UserTypeEnum } from "./enums";
import { HTTPStatusBody } from "../typings";

// Models
export interface ChatMessageModel {
  messageId: string;
  userType: UserTypeEnum;
  message: string;
}

export interface ChatListModel {
  chatId: string;
  chatName: string;
  updatedAt: string; // in timestamp format
}

export interface ChatInfoModel {
  userId: string;
  chatId: string;
  chatName: string;
  messages: ChatMessageModel[];
  createdAt: string; // in timestamp format
  updatedAt: string;
}

export interface UserInfoModel {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

// Return types
export interface PostQueryMessageResponseModel {
  status: HTTPStatusBody;
  data: {
    message: string;
  };
}

export interface GetChatListResponseModel {
  status: HTTPStatusBody;
  data: {
    chatList: ChatListModel[];
  };
}

export interface GetChatInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    chatInfo: ChatInfoModel;
  };
}

export interface GetUserInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    userInfo: UserInfoModel;
  };
}
