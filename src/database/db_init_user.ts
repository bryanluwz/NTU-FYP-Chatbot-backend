import { StoredUserInfoModel } from "../typings/chatTypings";
import { UserRoleEnum } from "../typings/enums";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

const intialiseUsers = (db: sqlite3.Database) => {
  // Insert Admin User, that can assign roles to other users
  const defaultPassword = "iwannasleeplol";
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  const users: StoredUserInfoModel[] = [
    {
      id: "69420",
      username: "Alice",
      email: "bruh@bruh.com",
      avatar: "src/assets/user-avatar-default.png",
      role: UserRoleEnum.Admin,
      password: hashedPassword,
    },
  ];

  users.forEach((user) => {
    db.run(
      "INSERT INTO users (id, username, email, avatar, role, password) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.username,
        user.email,
        user.avatar,
        user.role,
        user.password,
      ],
      (err: { message: any }) => {
        if (err) {
          console.error("Error inserting admin", err.message);
        }
      }
    );
  });
};

export default intialiseUsers;
