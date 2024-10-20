import {
  TransferDocumentSrcRequestModel,
  TransferDocumentSrcApiResponseModel,
  PostQueryMessageApiRequestModel,
  PostQueryMessageApiResponseModel,
} from "./typings";
import { changeDocumentSrcUrl, postQueryMessageUrl } from "./urls";
import fs from "fs";
import path from "path";

export const postQueryMessageApi = async (
  data: PostQueryMessageApiRequestModel
) => {
  return (
    await fetch(postQueryMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json() as unknown as PostQueryMessageApiResponseModel;
};

export const transferDocumentSrcApi = async (
  data: TransferDocumentSrcRequestModel
) => {
  const formData = new FormData();

  // Read the file from the local filesystem
  const filePath = data.documentSrcPath;
  const fileStream = fs.readFileSync(filePath);
  const fileBlob = new Blob([fileStream]);

  // Append the file blob to the form data
  formData.append("documentSrc", fileBlob, path.basename(filePath));
  formData.append("personaId", data.personaId);

  return (
    await fetch(changeDocumentSrcUrl, {
      method: "POST",
      body: formData,
    })
  ).json() as unknown as TransferDocumentSrcApiResponseModel;
};
