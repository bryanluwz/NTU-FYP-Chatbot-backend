import { ChatMessageModel, UserChatMessageModel } from "../typings/chatTypings";

export interface PostQueryMessageApiRequestModel {
  personaId: string;
  chatHistory: (UserChatMessageModel | ChatMessageModel)[];
  message:
    | string
    | {
        text: string;
        files: (File | Blob)[];
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
