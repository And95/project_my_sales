import "reflect-metadata";
import "express-async-errors";
import express from "express";
import cors from "cors";
import { errors } from "celebrate";

import routes from "./routes";
import ErrorHandleMiddleware from "@shared/middlewares/ErrorHandleMiddleware";
import { AppDataSource } from "@shared/typeorm/data-source";

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use(routes);
    app.use(errors());
    app.use(ErrorHandleMiddleware.handleError);

    console.log("Connected to the database successfully! 🎉");

    app.listen(3333, () => {
      console.log("Server started on port 3333! 🏆");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
