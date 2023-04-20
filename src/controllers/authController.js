import { db, signupSchema } from "../app.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  const validation = signupSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

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
