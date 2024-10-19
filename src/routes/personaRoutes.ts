import express from "express";
import {
  createPersona,
  deletePersona,
  getPersonaList,
  postPersonaList,
  updatePersona,
  uploadPersonaMiddleware,
} from "../controllers/personaController";
import { authenticateToken } from "../controllers/authController";

const PersonaRouter = express.Router();

PersonaRouter.get("/persona/available", authenticateToken, getPersonaList);
PersonaRouter.post("/persona/available", authenticateToken, postPersonaList);

PersonaRouter.post("/persona/create", authenticateToken, createPersona);
PersonaRouter.post(
  "/persona/update",
  authenticateToken,
  uploadPersonaMiddleware,
  updatePersona
);
PersonaRouter.post("/persona/delete", authenticateToken, deletePersona);

export default PersonaRouter;
