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
  const formData = new FormData();

  formData.append(
    "messageInfo",
    JSON.stringify({
      chatHistory: data.chatHistory,
      personaId: data.personaId,
      messageText: data.message.text,
    })
  );

  data.message.files.forEach((file) => {
    formData.append("files", file instanceof Blob ? file : new Blob([file]));
  });

  return (
    await fetch(postQueryMessageUrl, {
      method: "POST",
      body: formData,
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
