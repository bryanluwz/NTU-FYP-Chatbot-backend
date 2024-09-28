import { initialiseDatabase } from "./db_init";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or open a local SQLite database file
const dbPath = path.resolve(__dirname, "../../database/test.db"); // change db name here
const db = new sqlite3.Database(dbPath, (err: { message: any }) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }

  initialiseDatabase(db);
});

// Export the database and initialization function
export default db;
