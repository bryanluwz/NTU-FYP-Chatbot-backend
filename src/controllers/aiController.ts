import { Request, Response } from "express";

export const addDocumentMetadata = async (req: Request, res: Response) => {
  const { personaId, file_path, document_type, title, embedding_index } =
    req.body.data;
  const { user_id } = req.body;
};
