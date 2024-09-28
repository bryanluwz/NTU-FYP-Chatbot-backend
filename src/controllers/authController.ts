import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { HTTPResponseErrorWrapper } from "../typings";
import {
  GetUserRequestModel,
  GetUserResponseModel,
  LoginUserRequestModel,
  RegisterUserRequestModel,
  RegisterUserResponseModel,
} from "../typings/authTypings";
import { UserRoleEnum } from "../typings/enums";

export const registerUser = async (
  req: Request,
  res: Response<RegisterUserResponseModel | HTTPResponseErrorWrapper>
) => {
  const { username, email, password } = req.body as RegisterUserRequestModel;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please enter all fields." });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ error: "User already exists." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create and return JWT
    const payload = { userId: user.id };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      status: {
        code: 201,
        message: "User registered successfully.",
      },
      data: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || "",
          role: user.role || UserRoleEnum.User,
        },
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ error: "Server error." });
  }
};

export const loginUser = async (
  req: Request,
  res: Response<RegisterUserResponseModel | HTTPResponseErrorWrapper>
) => {
  const { email, password } = req.body as LoginUserRequestModel;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields." });
  }

  try {
    // Check for user
    let user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials." });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    // Create and return JWT
    const payload = { userId: user.id };

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      status: {
        code: 200,
        message: "User logged in successfully.",
      },
      data: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || "",
          role: user.role || UserRoleEnum.User,
        },
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ error: "Server error." });
  }
};

export const getUser = async (
  req: Request,
  res: Response<GetUserResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const { userId } = req.body as GetUserRequestModel;

    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({
      status: {
        code: 200,
        message: "User found successfully.",
      },
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || UserRoleEnum.User,
          avatar: user.avatar || "",
        },
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send({ error: "Server error." });
  }
};
