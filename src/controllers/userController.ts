import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { User } from "../models";
import { UserInfoModel } from "../typings/chatTypings";

export const updateUser = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  // This userId is the admin's (or requester) userId
  const userId = req.body.userId;
  const user = await User.findByPk(userId);

  if (!user || (user.role !== "admin" && user.userId !== userId)) {
    return res.status(404).json({ error: "Unauthorized" });
  }

  const userInfo = req.body.userInfo as UserInfoModel;

  try {
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
  const userId = req.body.userId;
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
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

export const createUser = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  const userId = req.body.userId;
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
  const userId = req.body.userId;
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
