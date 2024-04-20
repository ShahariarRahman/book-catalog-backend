import { ReviewAndRating } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { userResponseFields } from "../user/user.constant";
import { IReviewAndRatingRequest } from "./ReviewAndRating.interface";
import { checkCustomerAccess, isReviewExist } from "./ReviewAndRating.utils";

const insertIntoDB = async (
  user: JwtPayload,
  data: IReviewAndRatingRequest
): Promise<ReviewAndRating> => {
  const dbReview = await isReviewExist(user.userId, data.bookId);
  if (dbReview) {
    throw new ApiError(httpStatus.CONFLICT, "Review already exists!");
  }

  const result = await prisma.reviewAndRating.create({
    data: {
      ...data,
      userId: user.userId,
    },
    include: {
      user: {
        select: userResponseFields,
      },
      book: true,
    },
  });

  return result;
};

const getAllFromDB = async (): Promise<ReviewAndRating[]> => {
  const result = await prisma.reviewAndRating.findMany({
    include: {
      user: {
        select: userResponseFields,
      },
      book: true,
    },
  });

  return result;
};

const getByIdFromDB = async (id: string): Promise<ReviewAndRating> => {
  const result = await prisma.reviewAndRating.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: userResponseFields,
      },
      book: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "ReviewAndRating not found!");
  }

  return result;
};

const updateOneInDB = async (
  user: JwtPayload,
  id: string,
  payload: Partial<ReviewAndRating>
): Promise<ReviewAndRating> => {
  await checkCustomerAccess(user, id);

  const result = await prisma.reviewAndRating.update({
    where: {
      id,
    },
    data: payload,
    include: {
      user: {
        select: userResponseFields,
      },
      book: true,
    },
  });

  return result;
};

const deleteOneFromDB = async (
  user: JwtPayload,
  id: string
): Promise<ReviewAndRating> => {
  await checkCustomerAccess(user, id);
  const result = await prisma.reviewAndRating.delete({
    where: {
      id,
    },
    include: {
      user: {
        select: userResponseFields,
      },
      book: true,
    },
  });

  return result;
};

export const ReviewAndRatingService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteOneFromDB,
};
