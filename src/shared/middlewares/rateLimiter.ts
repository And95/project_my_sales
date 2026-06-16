import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ratelimit",
  points: 5,
  duration: 10,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // request.ip can be undefined; normalize to a string key for the limiter
    const ipKey = String(
      request.ip ||
        request.headers["x-forwarded-for"] ||
        request.socket?.remoteAddress ||
        "unknown",
    );

    await limiter.consume(ipKey);

    return next();
  } catch {
    throw new AppError("Too many requests.", 429);
  }
}
