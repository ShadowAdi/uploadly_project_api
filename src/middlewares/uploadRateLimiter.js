import rateLimit from "express-rate-limiter";
export const expressRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many avatar uploads. Please try again later.",
});
