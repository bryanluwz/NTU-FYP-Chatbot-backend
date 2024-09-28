// seeders/initializeUsers.ts
import { User } from "../models";
import { UserRoleEnum } from "../typings/enums";
import bcrypt from "bcrypt";

const MOCK_ID = "69420";
const MOCK_USERNAME = "我想跳楼";
const MOCK_EMAIL = "bruh@bruh.com";
const DEFAULT_AVATAR = "src/assets/user-avatar-default.png";
const MOCK_PASSWORD = "iwannajumpoffabuilding";

const initializeUsers = async () => {
  try {
    // Check if the admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: MOCK_EMAIL },
    });
    if (existingAdmin) {
      console.log("Admin user already exists. Skipping insertion.");
      return;
    }

    // Insert Admin User, that can assign roles to other users
    const defaultPassword = MOCK_PASSWORD;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminUser = await User.create({
      id: MOCK_ID,
      username: MOCK_USERNAME,
      email: MOCK_EMAIL,
      avatar: DEFAULT_AVATAR,
      role: UserRoleEnum.Admin,
      password: hashedPassword,
    });

    console.log("Admin user inserted successfully.");
  } catch (error) {
    console.error("Error inserting admin user:", error);
  }
};

export default initializeUsers;
