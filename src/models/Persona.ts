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
      defaultValue: "default_persona.png", // Default avatar
    },
  },
  {
    timestamps: true,
  }
);

export { Persona };
