import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.get("/:id", CategoryController.getByIdFromDB);

router.get("/", CategoryController.getAllFromDB);

router.post(
  "/create-category",
  validateRequest(CategoryValidation.createOrUpdate),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.insertIntoDB
);

router.patch(
  "/:id",
  validateRequest(CategoryValidation.createOrUpdate),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.updateOneInDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteOneFromDB
);

export const CategoryRoutes = router;
