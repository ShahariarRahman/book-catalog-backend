import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string().min(2, { message: "Title is too short" }),
    author: z.string().min(2, { message: "Author is too short" }),
    genre: z.string().min(2, { message: "Genre is too short" }),
    price: z.number().min(1, { message: "Price must be at least 1" }),
    publicationDate: z
      .string()
      .refine(dateString => !isNaN(Date.parse(dateString)), {
        message: "Invalid date format, expected ISO 8601",
      }),
    categoryId: z.string().uuid(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().min(2, { message: "Title is too short" }).optional(),
    author: z.string().min(2, { message: "Author is too short" }).optional(),
    genre: z.string().min(2, { message: "Genre is too short" }).optional(),
    price: z
      .number()
      .min(1, { message: "Price must be at least 1" })
      .optional(),
    publicationDate: z
      .string()
      .refine(dateString => !isNaN(Date.parse(dateString)), {
        message: "Invalid date format, expected ISO 8601",
      })
      .optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export const BookValidation = {
  create,
  update,
};
