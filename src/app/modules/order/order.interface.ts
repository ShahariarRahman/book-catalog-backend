import { OrderedBook, Status } from "@prisma/client";

export type IOrderedBookRequest = Pick<OrderedBook, "bookId" | "quantity">;

export type IOrderRequest = {
  orderedBooks: IOrderedBookRequest[];
  status?: Status;
};
