import { db } from "../database/database.connection.js";

export async function authValitaditon(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Token inexistente");

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.status(401).send("Token invalido");

    res.locals.session = session;

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
