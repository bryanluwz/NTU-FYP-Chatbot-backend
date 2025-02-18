"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Persona = exports.User = exports.sequelize = void 0;
// why no need to import everything here hmmm
const sequelize_1 = __importDefault(require("../database/sequelize"));
exports.sequelize = sequelize_1.default;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Persona_1 = require("./Persona");
Object.defineProperty(exports, "Persona", { enumerable: true, get: function () { return Persona_1.Persona; } });
const Chat_1 = require("./Chat");
Object.defineProperty(exports, "Chat", { enumerable: true, get: function () { return Chat_1.Chat; } });
// Initialize associations (if not already defined in individual models)
User_1.User.hasMany(Chat_1.Chat, { foreignKey: "userId" });
Chat_1.Chat.belongsTo(User_1.User, { foreignKey: "userId" });
Persona_1.Persona.hasMany(Chat_1.Chat, { foreignKey: "personaId" });
Chat_1.Chat.belongsTo(Persona_1.Persona, { foreignKey: "personaId" });
User_1.User.hasMany(Persona_1.Persona, { foreignKey: "userId" });
Persona_1.Persona.belongsTo(User_1.User, { foreignKey: "userId" });
