import { Request, Response } from "express";
import authRouter from "./modules/auth";
import categoryRouter from "./modules/categories";
import managerRouter from "./modules/main_management";
import imageRouter from "./modules/image";
export const routes = (app: any) => {
  // routes
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });
  app.use("/auth", authRouter);
  app.use("/management", managerRouter);
  app.use("/category", categoryRouter);
  app.use("/upload", imageRouter);
};
