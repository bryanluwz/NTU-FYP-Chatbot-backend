import { Request, Response } from "express";
import { GetUserListResponseModel } from "../typings/dashboardTypings";

import { HTTPResponseErrorWrapper } from "../typings";
import { User } from "../models";
import { UserInfoModel } from "../typings/chatTypings";

// Admin Dashboard (getUserList, updateUser, deleteUser, ...other actions)
export const getUserList = async (
  req: Request,
  res: Response<GetUserListResponseModel | HTTPResponseErrorWrapper>
) => {
  const userId = req.userId;

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
    const formattedUsers = usersWithoutPassword.map((user) => {
      return { ...user, avatar: `/avatars/${user.avatar}` };
    });
    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        users: formattedUsers,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chats" });
  }
};
