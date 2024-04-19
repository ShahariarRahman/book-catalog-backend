import { Status } from "@prisma/client";
import { z } from "zod";

const create = z.object({
  body: z.object({
    status: z.nativeEnum(Status).optional(),
    orderedBooks: z
      .array(
        z.object({
          bookId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .nonempty(),
  }),
});

export const OrderValidation = {
  create,
};
