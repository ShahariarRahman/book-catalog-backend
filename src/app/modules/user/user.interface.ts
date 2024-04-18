import { User } from "@prisma/client";

export type IUserResponseFields = Omit<User, "password">;
