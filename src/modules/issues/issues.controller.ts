import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../../utils/response";
import type { AuthRequest } from "../../middleware/auth.middleware";

// create issue
export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    res.send("create issue");
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// get all issues
export const getAllIssues = async (req: Request, res: Response) => {
  try {
    res.send("get all issues");
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// get single issue
export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    res.send("get single issue");
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.NOT_FOUND, error.message);
  }
};

// update issue
export const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    res.send("update issue");
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// delete issue
export const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    res.send("delete issue");
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.NOT_FOUND, error.message);
  }
};
