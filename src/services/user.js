import { User } from "../db-connector.js";

export async function upsertUser(req, res) {
  const user = req.body;

  const upsertedUser = await User.findOneAndUpdate(
    { id: user.id },
    {
      $setOnInsert: {
        username: user.username,
        id: user.id,
        name: user.name,
        integrations: {
          twitter: true,
        },
      },
    },
    {
      upsert: true,
    }
  );

  res.json(upsertedUser);
}
