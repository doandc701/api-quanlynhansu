import authRouter from "./modules/auth.js";
import categoryRouter from "./modules/categories.js";
import managerRouter from "./modules/main_management.js";
import imageRouter from "./modules/image.js";
import timekeepingRouter from "./modules/timekeeping.js";
export const routes = (app) => {
  // routes
  app.get("/", (req, res) => {
    res.json("Wellcome to api");
  });
  app.use("/auth", authRouter);
  app.use("/management", managerRouter);
  app.use("/category", categoryRouter);
  app.use("/upload", imageRouter);
  app.use("/timekeeping", timekeepingRouter);
};
