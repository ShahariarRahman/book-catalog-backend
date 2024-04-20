import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

export const isReviewExist = async (userId: string, bookId: string) => {
  return await prisma.reviewAndRating.findFirst({
    where: {
      userId,
      bookId,
    },
  });
};

export const checkCustomerAccess = async (
  user: JwtPayload,
  reviewId: string
) => {
  const reviewExist = await prisma.reviewAndRating.findUnique({
    where: {
      id: reviewId,
    },
    select: {
      userId: true,
    },
  });

  if (!reviewExist) {
    throw new ApiError(httpStatus.CONFLICT, "Review not Found!");
  }

  if (user.role === "customer" && reviewExist.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
};
