import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = express.Router();

router.get(
  "/:orderId",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  OrderController.getByIdFromDB
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  OrderController.getAllFromDB
);

router.post(
  "/create-order",
  validateRequest(OrderValidation.create),
  auth(ENUM_USER_ROLE.CUSTOMER),
  OrderController.insertIntoDB
);

export const OrderRoutes = router;
