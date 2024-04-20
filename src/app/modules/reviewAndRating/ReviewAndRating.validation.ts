import { z } from "zod";

const create = z.object({
  body: z.object({
    review: z.string().min(1).max(120),
    rating: z.number().int().min(1).max(5),
    bookId: z.string().uuid(),
  }),
});

const update = z.object({
  body: z.object({
    review: z.string().min(1).max(120).optional(),
    rating: z.number().int().min(1).max(5).optional(),
  }),
});

export const ReviewAndRatingValidation = {
  create,
  update,
};
