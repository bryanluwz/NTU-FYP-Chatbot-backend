import { User } from ".";
import sequelize from "../database/sequelize";
const { DataTypes } = require("sequelize");

const Persona = sequelize.define(
  "Persona",
  {
    personaId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
    },
    personaName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personaDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    personaAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "avatars/default_persona.png", // Default avatar
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentSrc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Persona.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Persona, { foreignKey: "userId" });

export { Persona };
