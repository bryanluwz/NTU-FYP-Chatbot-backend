import { HTTPStatusBody } from "../typings";
import { UserInfoModel } from "./chatTypings";

export interface PersonaModel {
  personaId: string;
  personaName: string;
  personaDescription: string;
  personaAvatar?: string;
  createdAt: number; // timestamp epoch
  updatedAt: number;
}

export interface GetPersonaResponseModel {
  status: HTTPStatusBody;
  data: {
    personas: PersonaModel[];
  };
}

export interface GetUserListResponseModel {
  status: HTTPStatusBody;
  data: {
    users: UserInfoModel[];
  };
}
