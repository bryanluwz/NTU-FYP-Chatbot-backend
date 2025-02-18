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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const mockdata_1 = require("./mockdata");
const initializePersonas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Iterate through each persona in mock data
        for (const persona of mockdata_1.personasMockData) {
            // Check if persona already exists
            const existingPersona = yield models_1.Persona.findOne({
                where: { personaId: persona.personaId },
            });
            if (existingPersona) {
                console.log(`Persona with ID ${persona.personaId} already exists. Skipping insertion.`);
                continue;
            }
            // Create persona
            yield models_1.Persona.create({
                personaId: persona.personaId,
                personaName: persona.personaName,
                personaDescription: persona.personaDescription,
                personaAvatar: persona.personaAvatar || "avatars/default_persona.png",
                createdAt: new Date(persona.createdAt),
                updatedAt: new Date(persona.updatedAt),
            });
            console.log(`Persona ${persona.personaName} inserted successfully.`);
        }
    }
    catch (error) {
        console.error("Error inserting mock personas:", error);
    }
});
exports.default = initializePersonas;
