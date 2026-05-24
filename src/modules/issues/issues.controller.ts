import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess, sendError } from "../../utils/response";
import type { AuthRequest } from "../../middleware/auth.middleware";
import {
  createIssueService,
  getAllIssuesService,
  getSingleIssueService,
  updateIssueService,
  deleteIssueService,
} from "./issues.service";

// create issue
export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !description || !type) {
      sendError(
        res,
        StatusCodes.BAD_REQUEST,
        "Title, description and type are required.",
      );
      return;
    }

    const issue = await createIssueService(
      { title, description, type },
      req.user!.id,
    );
    sendSuccess(res, StatusCodes.CREATED, "Issue created successfully", issue);
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// get all issues
export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await getAllIssuesService({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });
    res.status(StatusCodes.OK).json({ success: true, data: issues });
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

// get single issue
export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issue = await getSingleIssueService(req.params.id as string);
    res.status(StatusCodes.OK).json({ success: true, data: issue });
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.NOT_FOUND, error.message);
  }
};

// update issue
export const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issue = await updateIssueService(
      req.params.id as string,
      req.body,
      req.user!,
    );
    sendSuccess(res, StatusCodes.OK, "Issue updated successfully", issue);
  } catch (err) {
    const error = err as Error;

    // service throws CONFLICT: or FORBIDDEN: prefix so i can pick the right status code here
    if (error.message.includes("not found")) {
      sendError(res, StatusCodes.NOT_FOUND, error.message);
    } else if (error.message.startsWith("CONFLICT:")) {
      sendError(
        res,
        StatusCodes.CONFLICT,
        error.message.replace("CONFLICT: ", ""),
      );
    } else if (error.message.startsWith("FORBIDDEN:")) {
      sendError(
        res,
        StatusCodes.FORBIDDEN,
        error.message.replace("FORBIDDEN: ", ""),
      );
    } else {
      sendError(res, StatusCodes.BAD_REQUEST, error.message);
    }
  }
};

// delete issue
export const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    await deleteIssueService(req.params.id as string);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Issue deleted successfully" });
  } catch (err) {
    const error = err as Error;
    sendError(res, StatusCodes.NOT_FOUND, error.message);
  }
};
