import { personasMockData } from "./controllers/mockdata";
import {
  ChatInfoModel,
  ChatMessageModel,
  UserInfoModel,
} from "./typings/chatTypings";
import { PersonaModel } from "./typings/dashboardTypings";
import { UserTypeEnum } from "./typings/enums";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or open a local SQLite database file
const dbPath = path.resolve(__dirname, "../database/test.db"); // change db name here
const db = new sqlite3.Database(dbPath, (err: { message: any }) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }

  initializeDatabase();
});

// Function to initialize the database with mock data
const initializeDatabase = () => {
  // Initialize tables if not already created
  db.serialize(() => {
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
				avatar TEXT NOT NULL
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

// Function to insert mock data
const insertMockData = () => {
  // Insert mock users
  const users: UserInfoModel[] = [
    {
      id: "123",
      username: "Alice",
      email: "bruh@bruh.com",
      avatar: "src/assets/user-avatar-default.png",
    },
  ];

  users.forEach((user) => {
    db.run(
      "INSERT INTO users (id, username, email, avatar) VALUES (?, ?, ?, ?)",
      [user.id, user.username, user.email, user.avatar],
      (err: { message: any }) => {
        if (err) {
          console.error("Error inserting mock user", err.message);
        }
      }
    );
  });

  // Insert mock chats
  const chats: ChatInfoModel[] = [
    {
      chatId: "3",
      userId: "123",
      personaId: "10",
      chatName: "Chat 1",
      messages: [
        { messageId: "1", userType: UserTypeEnum.AI, message: "Hello!" },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      chatId: "4",
      userId: "123",
      personaId: "11",
      chatName: "Chat 2",
      messages: [
        { messageId: "3", userType: UserTypeEnum.AI, message: "nun!" },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  chats.forEach((chat) => {
    db.run(
      "INSERT INTO chats (chatId, userId, personaId, chatName, messages, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        chat.chatId,
        chat.userId,
        chat.personaId,
        chat.chatName,
        JSON.stringify(chat.messages),
        chat.createdAt,
        chat.updatedAt,
      ],
      (err: { message: any }) => {
        if (err) {
          console.error("Error inserting mock chat", err.message);
        }
      }
    );
  });

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

// Export the database and initialization function
export default db;
