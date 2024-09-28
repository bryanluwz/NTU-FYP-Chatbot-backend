import sqlite3 from "sqlite3";
import { personasMockData } from "../controllers/mockdata";
import { PersonaModel } from "../typings/dashboardTypings";

const intialisePersonas = (db: sqlite3.Database) => {
  // Insert mock personas
  const personas: PersonaModel[] = personasMockData;

  personas.forEach((persona) => {
    db.run(
      "INSERT INTO personas (personaId, personaName, personaDescription, personaAvatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        persona.personaId,
        persona.personaName,
        persona.personaDescription,
        persona.personaAvatar,
        persona.createdAt,
        persona.updatedAt,
      ],
      (err: { message: any }) => {
        if (err) {
          console.error("Error inserting mock persona", err.message);
        }
      }
    );
  });
};

export default intialisePersonas;
