import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../db-connector.js";

async function getTwitterUser(accessToken) {
  try {
    const res = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? null;
  } catch (err) {
    return null;
  }
}

export default async function me(req, res) {
  try {
    const token = req.cookies[process.env.OAUTH_COOKIE];
    if (!token) throw new Error("No oauth token cookie");

    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.accessToken)
      throw new Error("error decoding oauth token cookie");

    const userFromDb = await User.findOne({ id: payload?.id });
    if (!userFromDb) throw new Error("Not user in database");

    const twUser = await getTwitterUser(payload.accessToken);
    if (twUser?.id !== userFromDb.id) throw new Error("Not twitter user");

    res.json(userFromDb);
  } catch (err) {
    res.status(401).json({ message: "Not Authenticated", reason: err.message });
  }
}
