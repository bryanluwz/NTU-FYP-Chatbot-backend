export interface PostQueryMessageApiRequestModel {
  personaId: string;
  message: string;
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
