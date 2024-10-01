import { HTTPStatusBody } from ".";
import { UserInfoModel } from "./chatTypings";

export interface RegisterUserRequestModel {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequestModel {
  email: string;
  password: string;
}

export interface GetUserRequestModel {
  userId: string;
}

// Response model
export interface RegisterUserResponseModel {
  status: HTTPStatusBody;
  data: {
    token: string;
    user: UserInfoModel;
  };
}

export interface LoginUserResponseModel {
  status: HTTPStatusBody;
  data: {
    token: string;
    user: UserInfoModel;
  };
}

export interface GetUserResponseModel {
  status: HTTPStatusBody;
  data: {
    user: UserInfoModel;
  };
}
