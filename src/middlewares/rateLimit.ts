import ratelimit from "express-rate-limit";
import { Request, Response } from "express";

export const apiLimit = ratelimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many connection",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).send({
      status: 500,
      message: "Too many request",
    });
  },
  skip: (req: Request, res: Response) => {
    // if (req.ip === "::1") return true;
    return false;
  },
});
