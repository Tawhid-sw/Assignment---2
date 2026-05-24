import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/response";
import config from "../config";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

// check if token is valid
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["authorization"];

  if (!token) {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      "No token provided. Please login first.",
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as {
      id: number;
      name: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (err) {
    sendError(
      res,
      StatusCodes.UNAUTHORIZED,
      "Token is not valid or has expired.",
    );
  }
};

// allow maintainers
export const requireMaintainer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    sendError(res, StatusCodes.UNAUTHORIZED, "You must be logged in.");
    return;
  }

  if (req.user.role !== "maintainer") {
    sendError(
      res,
      StatusCodes.FORBIDDEN,
      "Only maintainers can perform this action.",
    );
    return;
  }

  next();
};
