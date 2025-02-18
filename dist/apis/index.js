"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQueryImageApi = exports.postSTTAudioApi = exports.postQueryMessageTTSApi = exports.transferDocumentSrcApi = exports.postQueryMessageApi = void 0;
const urls_1 = require("./urls");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const postQueryMessageApi = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new FormData();
    formData.append("messageInfo", JSON.stringify({
        chatHistory: data.chatHistory,
        personaId: data.personaId,
        messageText: data.message.text,
    }));
    const filePromises = data.message.files.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
        const fileStream = yield fs_1.default.promises.readFile(filePath);
        const fileBlob = new Blob([fileStream]);
        return {
            stream: fileBlob,
            name: path_1.default.basename(filePath),
        };
    }));
    const files = yield Promise.all(filePromises);
    files.forEach((file) => {
        formData.append("files", file.stream, file.name);
    });
    return (yield fetch(urls_1.postQueryMessageUrl, {
        method: "POST",
        body: formData,
    })).json();
});
exports.postQueryMessageApi = postQueryMessageApi;
const transferDocumentSrcApi = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new FormData();
    // Read the file from the local filesystem
    const filePath = data.documentSrcPath;
    const fileStream = fs_1.default.readFileSync(filePath);
    const fileBlob = new Blob([fileStream]);
    // Append the file blob to the form data
    formData.append("documentSrc", fileBlob, path_1.default.basename(filePath));
    formData.append("personaId", data.personaId);
    return (yield fetch(urls_1.changeDocumentSrcUrl, {
        method: "POST",
        body: formData,
    })).json();
});
exports.transferDocumentSrcApi = transferDocumentSrcApi;
const postQueryMessageTTSApi = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const formData = new FormData();
    formData.append("ttsName", data.ttsName);
    formData.append("text", data.text);
    const response = yield fetch(urls_1.postQueryMessageTTSUrl, {
        method: "POST",
        body: formData,
    });
    // Check if the response is a file
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.startsWith("audio/")) {
        // Get the file buffer
        const buffer = Buffer.from(yield response.arrayBuffer());
        // Save the file locally
        const filePath = (_a = data.responseFileDownloadPath) !== null && _a !== void 0 ? _a : path_1.default.join(__dirname, "output.mp3"); // Adjust the filename and path as needed
        fs_1.default.writeFileSync(filePath, buffer);
        return filePath; // Optionally return the file path
    }
    // Handle non-file responses
    const jsonData = yield response.json();
    return jsonData;
});
exports.postQueryMessageTTSApi = postQueryMessageTTSApi;
const postSTTAudioApi = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new FormData();
    formData.append("audio", data.audioBlob);
    return (yield fetch(urls_1.postSTTAudioUrl, {
        method: "POST",
        body: formData,
    })).json();
});
exports.postSTTAudioApi = postSTTAudioApi;
const postQueryImageApi = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = new FormData();
    formData.append("filename", data.filename);
    const response = yield fetch(urls_1.postQueryImageUrl, {
        method: "POST",
        body: formData,
    });
    const blob = yield response.blob();
    return blob;
});
exports.postQueryImageApi = postQueryImageApi;
