import dayjs from "dayjs";
import { db, transactionSchema } from "../app.js";

export async function postTransaction(req, res) {
  const { authorization } = req.headers;
  const { value, description, type } = req.body;
  const valueNumber = Number(value).toFixed(2);
  const date = dayjs().format("DD/MM");

  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Token inexistente");

  const validation = transactionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.status(401).send("Token invalido");

    await db.collection("transactions").insertOne({
      value: valueNumber,
      description: description,
      type: type,
      date: date,
      idUser: session.idUser,
    });
    res.status(201).send("Transacao adicionada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getTransactions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Token inexistente");

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.status(401).send("Token invalido");

    const transactions = await db
      .collection("transactions")
      .find({ idUser: session.idUser })
      .toArray();

    res.send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
