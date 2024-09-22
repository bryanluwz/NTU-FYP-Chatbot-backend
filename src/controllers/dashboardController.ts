import { Request, Response } from "express";
import {
  GetPersonaResponseModel,
  PersonaModel,
} from "../typings/dashboardTypings";

import db from "../database";
import { HTTPResponseErrorWrapper } from "../typings";

export const getAvailableChats = (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  db.all(
    "SELECT * FROM personas",
    (err: { message: any }, rows: PersonaModel[]) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chats" });
      }

      return res.json({
        status: {
          code: 200,
          message: "OK",
        },
        data: {
          personas: rows,
        },
      });
    }
  );
};
