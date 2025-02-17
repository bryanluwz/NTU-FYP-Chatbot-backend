// seeders/initializeUsers.ts
import { User } from "../models";
import { UserRoleEnum } from "../typings/enums";
import bcrypt from "bcrypt";
import { usersMockData } from "./mockdata";

const initializeUsers = async () => {
  try {
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({
      where: { role: UserRoleEnum.Admin },
    });
    if (existingAdmin) {
      console.log("Admin user already exists. Skipping insertion.");
      return;
    }

    // Insert mock users
    usersMockData.forEach(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });
    });

    console.log("Admin user inserted successfully.");
  } catch (error) {
    console.error("Error inserting admin user:", error);
  }
};

export const initializeAdmin = async () => {
  try {
    // This is the default admin user when the database is empty
    const defaultAdmin = {
      username: "admin",
      email: "admin@admin.com",
      password: "admin",
      role: UserRoleEnum.Admin,
    };

    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
    await User.create({ ...defaultAdmin, password: hashedPassword });
    console.log("Default admin user inserted successfully.");
  } catch (error) {
    console.error("Error inserting default admin user:", error);
  }
};

export default initializeUsers;
