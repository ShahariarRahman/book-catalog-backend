import { User } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { bcryptHelpers } from "../../../helpers/bcryptHelpers";
import prisma from "../../../shared/prisma";
import { userResponseFields } from "./user.constant";
import { IUserResponseFields } from "./user.interface";

const getAllUsers = async (): Promise<IUserResponseFields[]> => {
  const result = await prisma.user.findMany({
    select: userResponseFields,
  });
  return result;
};

const getSingleUser = async (id: string): Promise<IUserResponseFields> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: userResponseFields,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<User>
): Promise<IUserResponseFields> => {
  // check: payload not empty:
  if (!Object.keys(payload).length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Nothing to update. Please provide data!"
    );
  }

  // check: user exist:
  const dbUser = await prisma.user.findUnique({
    where: {
      id,
    },
    select: { id: true },
  });

  if (!dbUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (payload?.password) {
    payload.password = await bcryptHelpers.hashedPassword(payload.password);
  }

  const result = await prisma.user.update({
    data: payload,
    where: {
      id,
    },
    select: userResponseFields,
  });

  return result;
};

const deleteOneFromDB = async (id: string): Promise<IUserResponseFields> => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
    select: userResponseFields,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateOneInDB,
  deleteOneFromDB,
};
