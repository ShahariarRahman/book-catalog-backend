import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BookRoutes } from "../modules/book/book.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProfileRoutes } from "../modules/profile/profile.route";
import { ReviewAndRatingRoutes } from "../modules/reviewAndRating/ReviewAndRating.route";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/books",
    route: BookRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/reviews",
    route: ReviewAndRatingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
