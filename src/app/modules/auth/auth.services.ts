import { User } from "@prisma/client";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { bcryptHelpers } from "../../../helpers/bcryptHelpers";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { userResponseFields } from "../user/user.constant";
import { IUserResponseFields } from "../user/user.interface";
import { isUserExist } from "../user/users.utils";
import { ILoginUserResponse } from "./auth.interface";

const signup = async (data: User): Promise<IUserResponseFields> => {
  const dbUser = await isUserExist(data.email);
  if (dbUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This email is already registered!"
    );
  }

  const hashedPassword = await bcryptHelpers.hashedPassword(data.password);

  const userData: User = {
    ...data,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
    select: userResponseFields,
  });

  return result;
};

const signIn = async (
  data: Pick<User, "email" | "password">
): Promise<ILoginUserResponse> => {
  const dbUser = await isUserExist(data.email);
  if (!dbUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not registered yet!");
  }

  if (
    !dbUser?.password ||
    !(await bcryptHelpers.isMatched(data.password, dbUser.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const payload = {
    role: dbUser.role,
    userId: dbUser.id,
  };

  const accessToken = jwtHelpers.createToken(
    payload,
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    payload,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  signup,
  signIn,
};
