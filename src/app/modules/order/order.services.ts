import { Order, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IOrderRequest } from "./order.interface";

const insertIntoDB = async (
  user: JwtPayload,
  payload: IOrderRequest
): Promise<Order> => {
  const { orderedBooks, ...rest } = payload;

  const result = await prisma.$transaction(async prismaTx => {
    const createOrder = await prismaTx.order.create({
      data: {
        userId: user.userId,
        ...rest,
      },
    });

    if (!createOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
    }

    const formattedOrderedBooks = orderedBooks.map(book => ({
      ...book,
      orderId: createOrder.id,
    }));

    const createOrderBooks = await prismaTx.orderedBook.createMany({
      data: formattedOrderedBooks,
    });

    if (createOrderBooks.count !== orderedBooks.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create ordered books"
      );
    }

    const findOrder = await prismaTx.order.findUnique({
      where: {
        id: createOrder.id,
      },
      include: {
        orderedBooks: true,
      },
    });

    if (!findOrder) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to retrieve created order"
      );
    }

    return findOrder;
  });

  return result;
};

const getAllFromDB = async (user: JwtPayload): Promise<Order[]> => {
  const whereCondition: Prisma.OrderWhereInput = {};

  // if customer, then filter by userId otherwise show all
  if (user.role === "customer") {
    whereCondition.userId = user.userId;
  }

  const result = await prisma.order.findMany({
    where: whereCondition,
    include: {
      orderedBooks: true,
    },
  });

  return result;
};

const getByIdFromDB = async (
  orderId: string,
  user: JwtPayload
): Promise<Order> => {
  const result = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderedBooks: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");
  }
  if (user.role === "customer" && result?.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }

  return result;
};

export const OrderService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
};
