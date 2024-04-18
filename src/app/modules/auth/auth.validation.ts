import { UserRole } from "@prisma/client";
import { z } from "zod";

const signup = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(6, { message: "Password is required" }),
    role: z.nativeEnum(UserRole, { required_error: "Role is required" }),
    contactNo: z.string().min(1, { message: "Contact number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    profileImg: z.string().min(1, { message: "Profile image is required" }),
  }),
});

const signin = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(6, { message: "Password is required" }),
  }),
});

export const AuthValidation = {
  signup,
  signin,
};
