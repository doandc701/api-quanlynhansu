import ratelimit from "express-rate-limit";

export const apiLimit = ratelimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many connection",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).send({
      status: 500,
      message: "Too man",
    });
  },
  skip: (req, res) => {
    // if (req.ip === "::1") return true;
    return false;
  },
});
