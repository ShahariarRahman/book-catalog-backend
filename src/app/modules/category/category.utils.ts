import prisma from "../../../shared/prisma";

export const isCategoryExist = async (title: string) => {
  return await prisma.category.findFirst({
    where: {
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
  });
};
