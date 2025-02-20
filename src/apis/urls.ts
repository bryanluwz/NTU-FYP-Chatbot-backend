const portNumber = process.env.AI_PORT || 3001;
const host = process.env.AI_HOST || "0.0.0.0";

export const aiServerUrl = `https://${host}:${portNumber}`;

export const postQueryMessageUrl = `${aiServerUrl}/api/chat/query`;
export const changeDocumentSrcUrl = `${aiServerUrl}/api/chat/transferDocumentSrc`;
export const postQueryMessageTTSUrl = `${aiServerUrl}/api/chat/tts`;
export const postSTTAudioUrl = `${aiServerUrl}/api/chat/stt`;
export const postQueryImageUrl = `${aiServerUrl}/api/chat/postQueryImage`;
