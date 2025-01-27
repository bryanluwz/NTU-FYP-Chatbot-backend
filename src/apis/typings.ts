import { ChatMessageModel, UserChatMessageModel } from "../typings/chatTypings";

export interface PostQueryMessageApiRequestModel {
  personaId: string;
  chatHistory: (UserChatMessageModel | ChatMessageModel)[];
  message: {
    text: string;
    files: string[];
  };
}

export interface PostQueryMessageApiResponseModel {
  status: {
    code: number;
    message: string;
  };
  data: {
    response: string;
  };
}

export interface TransferDocumentSrcRequestModel {
  personaId: string;
  documentSrcPath: string;
}

export interface TransferDocumentSrcApiResponseModel {
  status: {
    code: number;
    message: string;
  };
  data: {
    response: string;
  };
}

export interface PostQueryMessageTTSApiRequestModel {
  ttsName: string;
  text: string;
}

export interface PostQueryMessageTTSApiResponseModel {
  status: {
    code: number;
    message: string;
  };
  data: {
    response: File;
  };
}
