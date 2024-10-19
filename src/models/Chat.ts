import sequelize from "../database/sequelize";
const { DataTypes } = require("sequelize");
import { User } from "./User";
import { Persona } from "./Persona";

const Chat = sequelize.define(
  "Chat",
  {
    chatId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    chatName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messages: {
      type: DataTypes.TEXT, // Store messages as JSON string
      allowNull: false,
      defaultValue: "[]",
      get(): any {
        const rawValue = (this as any).getDataValue("messages");
        return JSON.parse(rawValue);
      },
      set(value: any) {
        (this as any).setDataValue("messages", JSON.stringify(value));
      },
    },
    personaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Define Associations
// User.hasMany(Chat, { foreignKey: "userId" });
// Chat.belongsTo(User, { foreignKey: "userId" });

// Persona.hasMany(Chat, { foreignKey: "personaId" });
// Chat.belongsTo(Persona, { foreignKey: "personaId" });

export { Chat };
