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
exports.getPersona = exports.deletePersona = exports.updatePersona = exports.createPersona = exports.postPersonaList = exports.getPersonaList = exports.uploadPersonaMiddleware = void 0;
const models_1 = require("../models");
const enums_1 = require("../typings/enums");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const apis_1 = require("../apis");
// Define the absolute path for the uploads directory
const uploadDirectory = path_1.default.resolve(process.cwd(), process.env.UPLOADS_STORAGE || "uploads");
// Ensure the uploads directory exists
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
// Configure storage options
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// Initialize multer with storage options
const upload = (0, multer_1.default)({ storage });
// Middleware to handle multiple file uploads
exports.uploadPersonaMiddleware = upload.fields([
    { name: "personaAvatar", maxCount: 1 },
    { name: "documentSrc", maxCount: 1 },
]);
// Set up multer for file handling
const databaseAvatarStoragePath = path_1.default.resolve(process.cwd(), process.env.AVATARS_STORAGE || "avatars");
const databaseDocumentsStoragePath = path_1.default.resolve(process.cwd(), process.env.DOCUMENTS_STORAGE || "documents");
const getPersonaList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personas = (yield models_1.Persona.findAll());
        const formattedPersonas = personas.map((persona) => {
            const _persona = persona.toJSON();
            return Object.assign(Object.assign({}, _persona), { personaAvatar: `/avatars/${_persona.personaAvatar}` });
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                personas: formattedPersonas,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve chats" });
    }
});
exports.getPersonaList = getPersonaList;
const postPersonaList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user id from request
    const userId = req.userId;
    // If admin, return all, if educator, return only their personas, if user, don't return anything
    const user = yield models_1.User.findByPk(userId);
    if (!user) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    try {
        let personas = [];
        // Check if user is an admin, if yes return all
        if (user.role === enums_1.UserRoleEnum.Admin) {
            personas = (yield models_1.Persona.findAll());
        }
        else if (user.role === enums_1.UserRoleEnum.Educator) {
            personas = (yield models_1.Persona.findAll({
                where: {
                    userId: userId,
                },
            }));
        }
        const formattedPersonas = personas.map((persona) => {
            const _persona = persona.toJSON();
            return Object.assign(Object.assign({}, _persona), { personaAvatar: `/avatars/${_persona.personaAvatar}` });
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                personas: formattedPersonas,
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to create persona" });
    }
});
exports.postPersonaList = postPersonaList;
const createPersona = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { personaName, personaDescription } = req.body;
        const persona = yield models_1.Persona.create({
            personaName,
            personaDescription,
            userId: userId,
        });
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                personas: [persona],
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to create persona" });
    }
});
exports.createPersona = createPersona;
const updatePersona = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // The userId is the admin's or requester's userId
    const userId = req.userId;
    // Extract personaId from request params and the data to be updated from request body
    const personaInfo = JSON.parse(req.body.personaInfo);
    const { personaId, personaDescription, personaName } = personaInfo;
    const avatarFile = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.personaAvatar) === null || _b === void 0 ? void 0 : _b[0];
    const documentFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.documentSrc) === null || _d === void 0 ? void 0 : _d[0];
    const _avatarBuffer = (avatarFile === null || avatarFile === void 0 ? void 0 : avatarFile.path)
        ? fs_1.default.readFileSync(avatarFile.path)
        : null;
    const _documentBuffer = (documentFile === null || documentFile === void 0 ? void 0 : documentFile.path)
        ? fs_1.default.readFileSync(documentFile.path)
        : null;
    const avatar = _avatarBuffer
        ? Object.assign({ buffer: _avatarBuffer }, avatarFile) : null;
    const documentSrc = _documentBuffer
        ? Object.assign({ buffer: _documentBuffer }, documentFile) : null;
    try {
        // Find the persona to update
        const persona = yield models_1.Persona.findByPk(personaId);
        // If persona does not exist, return 404
        if (!persona) {
            return res.status(404).json({ error: "Persona not found" });
        }
        // Check if the user is the owner of the persona or an admin
        if (persona.userId !== userId) {
            const user = yield models_1.User.findByPk(userId);
            if (!user || user.role !== enums_1.UserRoleEnum.Admin) {
                return res.status(403).json({ error: "Unauthorized" });
            }
        }
        if (avatar) {
            // Generate a unique filename for the avatar
            const avatarFilename = `avatar_${(0, uuid_1.v4)()}${path_1.default.extname(avatar.originalname)}`;
            const newAvatarPath = path_1.default.join(databaseAvatarStoragePath, avatarFilename); // Adjust path as needed
            // Remove original avatar file
            if (persona.personaAvatar) {
                const avatarPath = path_1.default.join(databaseAvatarStoragePath, persona.personaAvatar);
                if (fs_1.default.existsSync(avatarPath)) {
                    fs_1.default.unlinkSync(avatarPath);
                }
            }
            // Upload avatar: save the file locally to the 'avatars' folder
            fs_1.default.writeFileSync(newAvatarPath, avatar.buffer);
            // Save the path (or URL if hosted) to userInfo
            persona.personaAvatar = `${avatarFilename}`; // Adjust path for how you'll serve the file
            // Remove from uploads
            if (fs_1.default.existsSync(avatarFile.path)) {
                fs_1.default.unlinkSync(avatarFile.path);
            }
        }
        if (documentSrc) {
            // Generate a unique filename for the documentSrc
            const documentSrcFilename = `documentSrc_${(0, uuid_1.v4)()}${path_1.default.extname(documentSrc.originalname)}`;
            const documentSrcPath = path_1.default.join(databaseDocumentsStoragePath, documentSrcFilename); // Adjust path as needed
            // Remove original documentSrc file
            if (persona.documentSrc) {
                const originalPath = path_1.default.join(databaseDocumentsStoragePath, persona.documentSrc);
                if (fs_1.default.existsSync(originalPath)) {
                    fs_1.default.unlinkSync(originalPath);
                }
            }
            // Upload documentSrc: save the file locally to the 'documents' folder
            fs_1.default.writeFileSync(documentSrcPath, documentSrc.buffer);
            // Save the path (or URL if hosted) to userInfo
            persona.documentSrc = `${documentSrcFilename}`; // Adjust path for how you'll serve the file
            // Remove from uploads
            if (fs_1.default.existsSync(documentFile.path)) {
                fs_1.default.unlinkSync(documentFile.path);
            }
            // Call the API to update the documentSrc
            const _response = yield (0, apis_1.transferDocumentSrcApi)({
                personaId: personaId,
                documentSrcPath: documentSrcPath,
            });
        }
        // Update the persona's name and description if provided
        if (personaName) {
            persona.personaName = personaName;
        }
        if (personaDescription) {
            persona.personaDescription = personaDescription;
        }
        // Save the updated persona information to the database
        yield persona.save();
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {},
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to update persona" });
    }
});
exports.updatePersona = updatePersona;
const deletePersona = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { personaId } = req.body;
        const persona = yield models_1.Persona.findByPk(personaId);
        if (!persona) {
            return res.status(404).json({ error: "Persona not found" });
        }
        if (persona.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        yield persona.destroy();
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                personas: [persona],
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to delete persona" });
    }
});
exports.deletePersona = deletePersona;
const getPersona = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the personaId from the request params
        const { id: chatId } = req.params;
        const chat = yield models_1.Chat.findByPk(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        const personaId = chat === null || chat === void 0 ? void 0 : chat.personaId;
        const persona = (yield models_1.Persona.findByPk(personaId));
        if (!persona) {
            return res.status(404).json({ error: "Persona not found" });
        }
        const avatarPath = path_1.default.join("/avatars", (_a = persona.personaAvatar) !== null && _a !== void 0 ? _a : "default");
        return res.json({
            status: {
                code: 200,
                message: "OK",
            },
            data: {
                personas: [Object.assign(Object.assign({}, persona), { personaAvatar: avatarPath })],
            },
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve persona avatar" });
    }
});
exports.getPersona = getPersona;
