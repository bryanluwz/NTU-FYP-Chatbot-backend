import { ChatUserTypeEnum, UserRoleEnum } from "./enums";
import { HTTPStatusBody } from "../typings";

// Models
export interface ChatMessageModel {
  messageId: string;
  userType: ChatUserTypeEnum;
  message: string;
}

export interface ChatListModel {
  chatId: string;
  chatName: string;
  updatedAt: string; // in timestamp format
}

export interface MinimumChatInfoModel {
  chatId: string;
  chatName?: string;
}

export interface ChatInfoModel extends MinimumChatInfoModel {
  userId: string;
  personaId: string; // frontend does not have this attribute
  messages: ChatMessageModel[];
  createdAt: number; // in timestamp format
  updatedAt: number;
}

export interface UserInfoModel {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRoleEnum;
}

export interface StoredUserInfoModel extends UserInfoModel {
  password: string; // hashed
}

export interface LoginRequestModel {
  email: string;
  password: string; // hashed
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

export interface GetMinimumChatInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    chatInfo: {
      chatId: string;
      chatName?: string;
    };
  };
}

export interface GetUserInfoResponseModel {
  status: HTTPStatusBody;
  data: {
    userInfo: UserInfoModel;
  };
}
