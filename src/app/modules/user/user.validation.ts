import { UserRole } from "@prisma/client";
import { z } from "zod";

const update = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(UserRole).optional(),
    contactNo: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    profileImg: z.string().min(1).optional(),
  }),
});

export const UserValidation = {
  update,
};
