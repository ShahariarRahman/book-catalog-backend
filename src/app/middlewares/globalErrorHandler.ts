import { Prisma } from "@prisma/client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import handleClientError from "../../errors/handleClientError";
import handleValidationError from "../../errors/handleValidationError";
import handleZodError from "../../errors/handleZodError";
import { IGenericErrorMessage } from "../../interfaces/error";
import { errorLogger } from "../../shared/logger";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === "development"
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  console.log("\x1b[31m%s\x1b[0m", error?.constructor?.name);

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
