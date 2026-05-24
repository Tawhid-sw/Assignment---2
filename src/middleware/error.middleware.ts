import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

// global error handler
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err.message);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong on the server.",
    errors: err.message,
  });
};

export default errorHandler;
