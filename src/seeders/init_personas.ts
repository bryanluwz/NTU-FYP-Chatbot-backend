import { Persona } from "../models";
import { personasMockData } from "../controllers/mockdata";

const initializePersonas = async () => {
  try {
    // Iterate through each persona in mock data
    for (const persona of personasMockData) {
      // Check if persona already exists
      const existingPersona = await Persona.findOne({
        where: { personaId: persona.personaId },
      });
      if (existingPersona) {
        console.log(
          `Persona with ID ${persona.personaId} already exists. Skipping insertion.`
        );
        continue;
      }

      // Create persona
      await Persona.create({
        personaId: persona.personaId,
        personaName: persona.personaName,
        personaDescription: persona.personaDescription,
        personaAvatar: persona.personaAvatar || "default_persona.png",
        createdAt: new Date(persona.createdAt),
        updatedAt: new Date(persona.updatedAt),
      });

      console.log(`Persona ${persona.personaName} inserted successfully.`);
    }
  } catch (error) {
    console.error("Error inserting mock personas:", error);
  }
};

export default initializePersonas;
