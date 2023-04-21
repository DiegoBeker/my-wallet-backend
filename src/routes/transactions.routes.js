import { Router } from "express";
import {
  getTransactions,
  postTransaction,
} from "../controllers/transactionController.js";
import { authValitaditon } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { transactionSchema } from "../schemas/transaction.schema.js";

const transactionsRouter = Router();

transactionsRouter.post(
  "/transactions",
  authValitaditon,
  validateSchema(transactionSchema),
  postTransaction
);
transactionsRouter.get("/transactions", authValitaditon, getTransactions);

export default transactionsRouter;
