import { z } from "zod";

const createOrUpdate = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Title is too short" }),
  }),
});

export const CategoryValidation = {
  createOrUpdate,
};
