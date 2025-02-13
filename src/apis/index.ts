import {
  TransferDocumentSrcRequestModel,
  TransferDocumentSrcApiResponseModel,
  PostQueryMessageApiRequestModel,
  PostQueryMessageApiResponseModel,
  PostQueryMessageTTSApiRequestModel,
  PostQueryMessageTTSApiResponseModel,
  PostSTTAudioApiRequestModel,
  PostSTTAudioApiResponseModel,
  PostQueryImageApiRequestModel as PostQueryImageApiRequestModel,
} from "./typings";
import {
  changeDocumentSrcUrl,
  postQueryImageUrl,
  postQueryMessageTTSUrl,
  postQueryMessageUrl,
  postSTTAudioUrl,
} from "./urls";
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

  const filePromises = data.message.files.map(async (filePath) => {
    const fileStream = await fs.promises.readFile(filePath);
    const fileBlob = new Blob([fileStream]);
    return {
      stream: fileBlob,
      name: path.basename(filePath),
    };
  });

  const files = await Promise.all(filePromises);

  files.forEach((file) => {
    formData.append("files", file.stream, file.name);
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

export const postQueryMessageTTSApi = async (
  data: PostQueryMessageTTSApiRequestModel
) => {
  const formData = new FormData();

  formData.append("ttsName", data.ttsName);

  formData.append("text", data.text);

  const response = await fetch(postQueryMessageTTSUrl, {
    method: "POST",
    body: formData,
  });

  // Check if the response is a file
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.startsWith("audio/")) {
    // Get the file buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Save the file locally
    const filePath =
      data.responseFileDownloadPath ?? path.join(__dirname, "output.mp3"); // Adjust the filename and path as needed
    fs.writeFileSync(filePath, buffer);

    return filePath; // Optionally return the file path
  }

  // Handle non-file responses
  const jsonData = await response.json();
  return jsonData as unknown as PostQueryMessageTTSApiResponseModel;
};

export const postSTTAudioApi = async (data: PostSTTAudioApiRequestModel) => {
  const formData = new FormData();

  formData.append("audio", data.audioBlob);

  return (await fetch(postSTTAudioUrl, {
    method: "POST",
    body: formData,
  }).then((response) =>
    response.json()
  )) as unknown as PostSTTAudioApiResponseModel;
};

export const postQueryImage = async (data: PostQueryImageApiRequestModel) => {
  const response = await fetch(
    `${postQueryImageUrl}?filename=${data.filename}`
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  return url;
};
