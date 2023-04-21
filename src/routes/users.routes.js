import { Router } from "express";
import { signIn, signUp } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signUpSchema } from "../schemas/signUp.schema.js";
import { signInSchema } from "../schemas/signIn.shema.js";

const usersRouter = Router();

usersRouter.post("/sign-up", validateSchema(signUpSchema), signUp);
usersRouter.post("/sign-in", validateSchema(signInSchema), signIn);

export default usersRouter;
