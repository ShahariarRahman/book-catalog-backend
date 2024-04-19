import { Book } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import {
  bookRelationalFieldsMapper,
  bookSearchableFields,
} from "./book.constant";
import { IBookFilterRequest } from "./book.interface";
import { isBookExist } from "./book.utils";

const insertIntoDB = async (data: Book): Promise<Book> => {
  const dbBook = await isBookExist(data.title);
  if (dbBook) {
    throw new ApiError(httpStatus.CONFLICT, "Book already exists!");
  }

  const dataWithDateFormat = {
    ...data,
    publicationDate: new Date(data.publicationDate),
  };

  const result = await prisma.book.create({
    data: dataWithDateFormat,
    include: {
      category: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IBookFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) =>
        Object.keys(bookRelationalFieldsMapper).includes(field)
          ? {
              [bookRelationalFieldsMapper[field]]: {
                id: value,
              },
            }
          : field === "minPrice"
          ? {
              price: {
                gte: Number(value),
              },
            }
          : field === "maxPrice"
          ? {
              price: {
                lte: Number(value),
              },
            }
          : {
              [field]: value,
            }
      ),
    });
  }

  const whereCondition = andConditions.length ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      category: true,
    },
    where: whereCondition,
  });

  const total = await prisma.book.count({ where: whereCondition });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getBooksByCategoryId = async (categoryId: string): Promise<Book[]> => {
  const result = await prisma.book.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getByIdFromDB = async (id: string): Promise<Book> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found!");
  }

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Book>
): Promise<Book> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};

const deleteOneFromDB = async (id: string): Promise<Book> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

export const BookService = {
  insertIntoDB,
  getAllFromDB,
  getBooksByCategoryId,
  getByIdFromDB,
  updateOneInDB,
  deleteOneFromDB,
};
