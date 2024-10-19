// why no need to import everything here hmmm
import sequelize from "../database/sequelize";
import { User } from "./User";
import { Persona } from "./Persona";
import { Chat } from "./Chat";

// Initialize associations (if not already defined in individual models)
User.hasMany(Chat, { foreignKey: "userId" });
Chat.belongsTo(User, { foreignKey: "userId" });

Persona.hasMany(Chat, { foreignKey: "personaId" });
Chat.belongsTo(Persona, { foreignKey: "personaId" });

User.hasMany(Persona, { foreignKey: "userId" });
Persona.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Persona, Chat };
