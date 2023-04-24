import dayjs from "dayjs";
import { db } from "../database/database.connection.js";
import { ObjectId } from "mongodb";

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

export async function deleteTransaction(req, res) {
  const { id } = req.params;

  try {
    const deleteTransaction = await db
      .collection("transactions")
      .deleteOne({ _id: new ObjectId(id) });

    if (deleteTransaction.deletedCount === 0) return res.sendStatus(404);

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updateTransaction(req, res) {
  const { value, description } = req.body;
  const { id } = req.params;
  const valueNumber = Number(value).toFixed(2);

  try {
    const editTransaction = await db
      .collection("transactions")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { value: valueNumber, description: description } }
      );

    if (editTransaction.matchedCount === 0) return res.sendStatus(404);

    res.sendStatus(202);
  } catch (error) {
    res.status(500).send(error);
  }
}
