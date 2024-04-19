import prisma from "../../../shared/prisma";

export const isUserExist = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
