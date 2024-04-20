import { ReviewAndRating } from "@prisma/client";

export type IReviewAndRatingRequest = Pick<
  ReviewAndRating,
  "bookId" | "rating" | "review"
>;
