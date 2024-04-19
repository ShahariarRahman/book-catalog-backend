import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookController } from "./book.controller";
import { BookValidation } from "./book.validation";

const router = express.Router();

router.get("/:categoryId/category", BookController.getBooksByCategoryId);
router.get("/:id", BookController.getByIdFromDB);
router.get("/", BookController.getAllFromDB);

router.post(
  "/create-book",
  validateRequest(BookValidation.create),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookController.insertIntoDB
);

router.patch(
  "/:id",
  validateRequest(BookValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookController.updateOneInDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BookController.deleteOneFromDB
);

export const BookRoutes = router;
