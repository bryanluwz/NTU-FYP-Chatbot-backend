import sequelize from "../database/sequelize";
import { UserRoleEnum } from "../typings/enums";

const { DataTypes } = require("sequelize");

const DefaultUserAvatar = "src/assets/user-avatar-default.png";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
    role: {
      type: DataTypes.ENUM(Object.values(UserRoleEnum)),
      defaultValue: "user",
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: DefaultUserAvatar,
    },
  },
  {
    timestamps: true,
  }
);

export { User };
