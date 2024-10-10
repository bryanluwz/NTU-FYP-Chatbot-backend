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
