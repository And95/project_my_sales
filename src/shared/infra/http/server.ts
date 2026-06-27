import ErrorHandleMiddleware from "@shared/middlewares/ErrorHandleMiddleware";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import rateLimiter from "@shared/middlewares/rateLimiter";
import { errors } from "celebrate";
import "express-async-errors";
import express from "express";
import routes from "./routes";
import "@shared/container";
import "reflect-metadata";
import cors from "cors";

const startServer = async () => {
  await AppDataSource.initialize();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(rateLimiter);
  app.use(routes);
  app.use(errors());
  app.use(ErrorHandleMiddleware.handleError);
  console.log("Connected to the database! 🎉");
  return app;
};

export default startServer()
  .then((app) => {
    return app.listen(3333, () => {
      console.log("Server started on port 3333! 🏆");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the serve:", error);
  });
