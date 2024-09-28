import sqlite3 from "sqlite3";
import intialiseUsers from "./db_init_user";
import intialiseChats from "./db_init_chat";
import intialisePersonas from "./db_init_persona";

export const initialiseDatabase = (db: sqlite3.Database) => {
  // Function to insert mock data
  const insertMockData = () => {
    intialiseUsers(db);
    intialiseChats(db);
    intialisePersonas(db);
  };

  // Initialize tables if not already created
  db.serialize(() => {
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
				avatar TEXT NOT NULL,
				role TEXT NOT NULL,
				password TEXT NOT NULL
      )`);

    // Create Chats table
    db.run(`CREATE TABLE IF NOT EXISTS chats (
				chatId TEXT PRIMARY KEY,
				userId TEXT NOT NULL,
				personaId TEXT NOT NULL, -- foreign key to personas table
				chatName TEXT NOT NULL,
				messages TEXT NOT NULL, -- JSON string to store messages
				createdAt INTEGER NOT NULL,
				updatedAt INTEGER NOT NULL,
				FOREIGN KEY (userId) REFERENCES users(id)
				FOREIGN KEY (personaId) REFERENCES personas(personaId)
			)`);

    // Create Personas table
    db.run(`CREATE TABLE IF NOT EXISTS personas (
				personaId TEXT PRIMARY KEY,
				personaName TEXT NOT NULL,
				personaDescription TEXT NOT NULL,
				personaAvatar TEXT,
				createdAt INTEGER NOT NULL,
				updatedAt INTEGER NOT NULL
			)`);

    // Check if there are any users already in the table
    db.get(
      "SELECT COUNT(*) AS count FROM users",
      (err: { message: any }, row: { count: number }) => {
        if (err) {
          console.error("Error checking users count", err.message);
        } else if (row.count === 0) {
          console.log("No users found, inserting mock data...");
          insertMockData();
        }
      }
    );
  });
};
