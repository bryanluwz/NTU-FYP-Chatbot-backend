import app from "./app";
import initializePersonas from "./seeders/init_personas";
import initializeUsers from "./seeders/init_users";
import { User } from "./models";
import sequelize from "./database/sequelize";

// So that I could goddamn add a userId to the goddamn request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Start the server after syncing the database
const initMockData = async () => {
  await initializeUsers();
  // await initializePersonas();
};

sequelize
  .sync({ force: false }) // Set to true to drop and recreate tables on every run
  .then(async () => {
    console.log("Database synced.");

    // Check if the database is empty before inserting mock data
    const userCount = await User.count();
    if (userCount === 0) {
      console.log("No users found, inserting mock data...");
      await initMockData();
    }

    // app.listen(PORT as number, "0.0.0.0", () => {
    //   console.log(`Server running on port ${PORT}`);
    // });

    https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on https://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });
