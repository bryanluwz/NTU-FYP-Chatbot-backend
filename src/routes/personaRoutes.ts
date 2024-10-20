import express from "express";
import {
  createPersona,
  deletePersona,
  getPersona,
  getPersonaList,
  postPersonaList,
  updatePersona,
  uploadPersonaMiddleware,
} from "../controllers/personaController";
import { authenticateToken } from "../controllers/authController";
import { Persona } from "../models";

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
PersonaRouter.get("/persona/:id", getPersona);

export default PersonaRouter;
