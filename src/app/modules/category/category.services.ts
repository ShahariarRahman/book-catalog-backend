import { Category } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { isCategoryExist } from "./category.utils";

const insertIntoDB = async (data: Category): Promise<Category> => {
  const dbCategory = await isCategoryExist(data.title);
  if (dbCategory) {
    throw new ApiError(httpStatus.CONFLICT, "Category already exists!");
  }
  const result = await prisma.category.create({
    data,
  });

  return result;
};

const getAllFromDB = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany();
  return result;
};

const getByIdFromDB = async (id: string): Promise<Category> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found!");
  }

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Category
): Promise<Category> => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteOneFromDB = async (id: string): Promise<Category> => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteOneFromDB,
};
