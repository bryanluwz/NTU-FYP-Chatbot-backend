import multer from "multer";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { User } from "../models";
import {
  GetUserInfoResponseModel,
  GetUserSettingsResponseModel,
  UserInfoModel,
} from "../typings/chatTypings";
import { UserRoleEnum } from "../typings/enums";
import path from "path";
import fs from "fs";

// Set up multer for file handling
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const databaseAvatarStoragePath = path.resolve(
  process.cwd(),
  process.env.AVATARS_STORAGE || "avatars"
);

export const updateUser = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  // This userId is the admin's (or requester) userId
  const userId = req.userId;
  const user = await User.findByPk(userId);

  if (!user || (user.role !== UserRoleEnum.Admin && user.id !== userId)) {
    return res.status(404).json({ error: "Unauthorized" });
  }

  const avatar = req.file;
  const userInfo = JSON.parse(req.body.userInfo) as UserInfoModel;

  try {
    // Upload avatar here
    if (avatar) {
      // Generate a unique filename for the avatar
      const avatarFilename = `avatar_${uuidv4()}${path.extname(
        avatar.originalname
      )}`;
      const avatarPath = path.join(databaseAvatarStoragePath, avatarFilename); // Adjust path as needed

      // Remove original avatar file
      if (user.avatar) {
        const avatarPath = path.join(databaseAvatarStoragePath, user.avatar);
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }

      // Upload avatar: save the file locally to the 'uploads' folder
      fs.writeFileSync(avatarPath, avatar.buffer);

      // Save the path (or URL if hosted) to userInfo
      userInfo.avatar = `${avatarFilename}`; // Adjust path for how you'll serve the file
    }

    await User.update(userInfo, { where: { id: userInfo.id } });

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;
  const user = await User.findByPk(userId);
  const userInfo = req.body.userInfo as UserInfoModel;

  if (!user || user.role !== "admin" || userInfo.id === userId) {
    // Check admin or delete self
    return res.status(404).json({ error: "Unauthorized" });
  }

  try {
    await User.destroy({ where: { id: userInfo.id } });

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const createUser = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;
  const user = await User.findByPk(userId);

  if (!user || user.role !== "admin") {
    return res.status(404).json({ error: "Unauthorized" });
  }

  const userInfo = req.body.user as UserInfoModel;

  try {
    await User.create(userInfo);

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const udpateUserPassword = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;
  const user = (await User.findByPk(userId)) as UserInfoModel;

  if (!user || user.id !== userId) {
    return res.status(404).json({ error: "Unauthorized" });
  }

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    // check if old password is correct
    const user = await User.findByPk(userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(404).json({ error: "Unauthorized" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update user password" });
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response<GetUserInfoResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;

  try {
    const user = (await User.findByPk(userId)) as UserInfoModel;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const avatarPath = path.join("/avatars", user.avatar);

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        userInfo: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: avatarPath,
        },
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve user info" });
  }
};

export const updateUserSettingsConfig = async (
  req: Request,
  res: Response<GetUserSettingsResponseModel | HTTPResponseErrorWrapper>
) => {
  const action = req.body.action as string;
  switch (action) {
    case "get":
      return getUserSettings(req, res);
    case "update":
      return updateUserSettings(req, res);
    default:
      return res.status(400).json({ error: "Invalid action" });
  }
};

const getUserSettings = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = (await User.findByPk(userId)) as UserInfoModel;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        settings: user.settings ?? {},
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve user settings" });
  }
};

const updateUserSettings = async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = (await User.findByPk(userId)) as UserInfoModel;

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const originalSettings = user.settings;
  const settings = req.body.userSettings;

  try {
    const updatedSettings = { ...originalSettings, ...settings };
    await User.update({ settings: updatedSettings }, { where: { id: userId } });

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update user settings" });
  }
};

export const uploadUserMiddleware = upload.single("avatar"); // 'avatar' is the field name for the image
