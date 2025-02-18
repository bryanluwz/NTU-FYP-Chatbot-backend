"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personaController_1 = require("../controllers/personaController");
const authController_1 = require("../controllers/authController");
const PersonaRouter = express_1.default.Router();
PersonaRouter.get("/persona/available", authController_1.authenticateToken, personaController_1.getPersonaList);
PersonaRouter.post("/persona/available", authController_1.authenticateToken, personaController_1.postPersonaList);
PersonaRouter.post("/persona/create", authController_1.authenticateToken, personaController_1.createPersona);
PersonaRouter.post("/persona/update", authController_1.authenticateToken, personaController_1.uploadPersonaMiddleware, personaController_1.updatePersona);
PersonaRouter.post("/persona/delete", authController_1.authenticateToken, personaController_1.deletePersona);
PersonaRouter.get("/persona/:id", personaController_1.getPersona);
exports.default = PersonaRouter;
