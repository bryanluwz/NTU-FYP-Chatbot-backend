import { readFileSync, existsSync } from "fs";

let host: string;
if (existsSync("/run/secrets/python_server_endpoint")) {
  host = readFileSync("/run/secrets/python_server_endpoint", "utf-8").trim();
  console.log("Python server endpoint via secrets: ", host);
} else {
  host = process.env.AI_HOST || "0.0.0.0";
  console.log("Python server endpoint via default: ", host);
}

const portNumber = process.env.AI_PORT || 3001;

export const aiServerUrl = `${host}:${portNumber}`;

export const postQueryMessageUrl = `${aiServerUrl}/api/chat/query`;
export const changeDocumentSrcUrl = `${aiServerUrl}/api/chat/transferDocumentSrc`;
export const postQueryMessageTTSUrl = `${aiServerUrl}/api/chat/tts`;
export const postSTTAudioUrl = `${aiServerUrl}/api/chat/stt`;
export const postQueryImageUrl = `${aiServerUrl}/api/chat/postQueryImage`;
export const getQueryVoicesUrl = `${aiServerUrl}/api/chat/availableVoices`;
