import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { signInSchema } from "../schemas/signIn.shema.js";
import { signUpSchema } from "../schemas/signUp.schema.js";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const emailExists = await db.collection("users").findOne({ email: email });
    if (emailExists) return res.status(409).send("E-mail já foi cadastrado!");

    const hash = bcrypt.hashSync(password, 10);

    await db
      .collection("users")
      .insertOne({ name: name, email: email, password: hash });

    res.status(201).send("Conta criada com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  
  try {
    const user = await db.collection("users").findOne({ email: email });
    if (!user) res.status(404).send("E-mail não cadastrado");

    const passwordIsCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordIsCorrect) return res.status(401).send("Senha incorreta");

    const token = uuid();

    await db
      .collection("sessions")
      .insertOne({ idUser: user._id, token: token });

    res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
