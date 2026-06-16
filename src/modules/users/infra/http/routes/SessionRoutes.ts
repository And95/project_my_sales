import { Router } from "express";
import SessionsControllers from "../controllers/SessionsControllers";
import { SessionSchema } from "../schemas/SessionSchemas";

const sessionsRouter = Router();
const sessionController = new SessionsControllers();

sessionsRouter.post("/", SessionSchema, sessionController.create);

export default sessionsRouter;
