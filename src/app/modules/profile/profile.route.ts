import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { ProfileController } from "./profile.controller";

const router = express.Router();

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  ProfileController.profile
);

export const ProfileRoutes = router;
