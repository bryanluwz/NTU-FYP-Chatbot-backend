const { Sequelize } = require("sequelize");
const path = require("path");

require("dotenv").config();

const databaseStoragePath = path.resolve(
  process.cwd(),
  process.env.DATABASE_STORAGE || "database.db"
);

// Initialize Sequelize to use SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databaseStoragePath, // Database file path
  logging: false, // Disable logging; default: console.log
});

export default sequelize;
