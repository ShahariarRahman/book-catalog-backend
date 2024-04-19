import prisma from "../../../shared/prisma";

export const isBookExist = async (title: string) => {
  return await prisma.book.findFirst({
    where: {
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
  });
};
