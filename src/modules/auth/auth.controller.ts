import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess, sendError } from "../../utils/response";
import { authService } from "./auth.service";
import type { signupProps, loginProps } from "./auth.interface";

// signup
const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as signupProps;

    if (!name || !email || !password || !role) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        "Name, email, password and role are required.",
      );
      return;
    }

    const newUser = await authService.signupUser({
      name,
      email,
      password,
      role,
    });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      "User registered successfully",
      newUser,
    );
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// login
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as loginProps;

    if (!email || !password) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        "Email and password are required.",
      );
      return;
    }

    const data = await authService.loginUser({ email, password });
    sendSuccess(res, StatusCodes.OK, "Login successful", data);
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.UNAUTHORIZED, error.message);
  }
};

export const authController = {
  signup,
  login,
};
