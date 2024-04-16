import { Prisma } from "@prisma/client";
import { IGenericErrorMessage } from "../interfaces/error";

const handleClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  let message = "";

  switch (error.code) {
    case "P2025":
      message = (error.meta?.cause as string) || "Record not found";
      break;
    case "P2003":
      message = error.message.includes("delete()` invocation:")
        ? "Delete failed"
        : "Invalid foreign key";
      break;
    default:
      message = "Unhandled Prisma error";
  }

  const errors: IGenericErrorMessage[] = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError;
