import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { userResponseFields } from "../user/user.constant";
import { IUserResponseFields } from "../user/user.interface";

const profile = async (payload: JwtPayload): Promise<IUserResponseFields> => {
  const { userId } = payload;

  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userResponseFields,
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return result;
};

export const ProfileService = {
  profile,
};
