import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewAndRatingController } from "./ReviewAndRating.controller";
import { ReviewAndRatingValidation } from "./ReviewAndRating.validation";

const router = express.Router();

router.get("/:id", ReviewAndRatingController.getByIdFromDB);
router.get("/", ReviewAndRatingController.getAllFromDB);

router.post(
  "/",
  validateRequest(ReviewAndRatingValidation.create),
  auth(ENUM_USER_ROLE.CUSTOMER),
  ReviewAndRatingController.insertIntoDB
);

router.patch(
  "/:id",
  validateRequest(ReviewAndRatingValidation.update),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  ReviewAndRatingController.updateOneInDB
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  ReviewAndRatingController.deleteOneFromDB
);

export const ReviewAndRatingRoutes = router;
