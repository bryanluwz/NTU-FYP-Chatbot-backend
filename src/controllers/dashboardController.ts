import { Request, Response } from "express";
import {
  GetPersonaResponseModel,
  GetUserListResponseModel,
  PersonaModel,
} from "../typings/dashboardTypings";

import { Persona } from "../models/Persona";
import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import { User } from "../models";
import { UserInfoModel } from "../typings/chatTypings";

export const getAvailableChats = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const personas = (await Persona.findAll()) as PersonaModel[];

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chats" });
  }
};

// Admin Dashboard (getUserList, updateUser, deleteUser, ...other actions)
export const getUserList = async (
  req: Request,
  res: Response<GetUserListResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = req.body.userId;

  // Check if user is an admin
  const user = await User.findByPk(userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const users = await User.findAll();
    const usersWithoutPassword = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    }) as UserInfoModel[];
    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        users: usersWithoutPassword,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chats" });
  }
};

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
