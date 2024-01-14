import authRouter from "./modules/auth.js";
import categoryRouter from "./modules/categories.js";
import managerRouter from "./modules/main_management.js";
import imageRouter from "./modules/image.js";
import timekeepingRouter from "./modules/timekeeping.js";
import statisticRouter from "./modules/statistics.js";
import dashboardRouter from "./modules/dashboard-post.js";
import { jwtAuthMiddleware } from "../middlewares/authJwt.js";
export const routes = (app) => {
  // routes
  app.get("/", (req, res) => {
    res.json("Wellcome to api");
  });
  app.use("/auth", authRouter);
  app.use("/management", jwtAuthMiddleware, managerRouter);
  app.use("/category", jwtAuthMiddleware, categoryRouter);
  app.use("/upload", jwtAuthMiddleware, imageRouter);
  app.use("/timekeeping", jwtAuthMiddleware, timekeepingRouter);
  app.use("/statistics", jwtAuthMiddleware, statisticRouter);
  app.use("/post-dashboard", jwtAuthMiddleware, dashboardRouter);
};
