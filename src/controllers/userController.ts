import multer from "multer";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { User } from "../models";
import {
  GetUserInfoResponseModel,
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
      const avatarFilename = `${
        userInfo.username
      }_avatar_${uuidv4()}${path.extname(avatar.originalname)}`;
      const avatarPath = path.join(databaseAvatarStoragePath, avatarFilename); // Adjust path as needed

      // Upload avatar: save the file locally to the 'uploads' folder
      fs.writeFileSync(avatarPath, avatar.buffer);

      // Save the path (or URL if hosted) to userInfo
      userInfo.avatar = `${avatarFilename}`; // Adjust path for how you'll serve the file

      // Remove original avatar file
      if (user.avatar) {
        const avatarPath = path.join(databaseAvatarStoragePath, user.avatar);
        fs.unlinkSync(avatarPath);
      }
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

  if (!user || user.role !== "admin") {
    return res.status(404).json({ error: "Unauthorized" });
  }

  const userInfo = req.body.userInfo as UserInfoModel;

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

export const uploadMiddleware = upload.single("avatar"); // 'avatar' is the field name for the image
