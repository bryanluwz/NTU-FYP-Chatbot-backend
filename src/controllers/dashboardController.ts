import { Request, Response } from "express";
import {
  GetPersonaResponseModel,
  PersonaModel,
} from "../typings/dashboardTypings";

import { Persona } from "../models/Persona";
import { HTTPResponseErrorWrapper } from "../typings";

export const getAvailableChats = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const personas = (await Persona.findAll()) as PersonaModel[];

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chats" });
  }
};
