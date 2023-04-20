import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import { signIn, signUp } from "./controllers/authController.js";
import { getTransactions, postTransaction } from "./controllers/transactionController.js";

//config
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//mongodb
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
  await mongoClient.connect();
  console.log("MongoDB conectado!");
} catch (err) {
  console.log(err.message);
}
export const db = mongoClient.db();

//schemas
export const signupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

export const transactionSchema = joi.object({
  value: joi.number().precision(1).positive().required(),
  description: joi.string().required(),
  type: joi.valid("income", "expense").required()
});

//endpoints
app.post("/sign-up", signUp);
app.post("/sign-in", signIn);
app.post("/transactions", postTransaction);
app.get("/transactions", getTransactions);

const PORT = 5000;
app.listen(PORT, () => console.log("Servidor rodando na porta 5000"));
