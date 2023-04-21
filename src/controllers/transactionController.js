import dayjs from "dayjs";
import { db } from "../database/database.connection.js";
import { transactionSchema } from "../schemas/transaction.schema.js";

export async function postTransaction(req, res) {
  const session = res.locals.session;
  const { value, description, type } = req.body;
  const valueNumber = Number(value).toFixed(2);
  const date = dayjs().format("DD/MM");
  
  try {
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
  const session = res.locals.session;

  try {
    const transactions = await db
      .collection("transactions")
      .find({ idUser: session.idUser })
      .toArray();

    res.send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
