import axios from "axios";
import { User } from "../db-connector.js";
import jwt from "jsonwebtoken";

const basicAuthToken = Buffer.from(
  `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
  "utf8"
).toString("base64");

const twitterOauthTokenParams = {
  code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
  redirect_uri: process.env.TWITTER_REDIRECT_URI,
  grant_type: "authorization_code",
};

async function getTwitterOAuthToken(code) {
  try {
    const res = await axios.post(
      process.env.TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthToken}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getTwitterUser(accessToken) {
  try {
    const res = await axios.get(process.env.TWITTER_OAUTH_USER_URL, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function upsertUser(twitterUser) {
  return User.findOneAndUpdate(
    { id: twitterUser.id },
    {
      $setOnInsert: {
        username: twitterUser.username,
        id: twitterUser.id,
        name: twitterUser.name,
        integrations: {
          twitter: true,
        },
      },
    },
    {
      upsert: true,
    }
  );
}

function addCookieToRes(res, user, accessToken) {
  const { id } = user;
  const token = jwt.sign(
    {
      id,
      accessToken,
    },
    process.env.JWT_SECRET
  );

  res.cookie(process.env.OAUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 7200 * 1000),
  });
}

export default async function twitterOauth(req, res) {
  const code = req.query.code;

  const twitterOAuthToken = await getTwitterOAuthToken(code);

  if (!twitterOAuthToken) {
    return res.redirect(process.env.TWITTER_CALLBACK_URL);
  }

  const twitterUser = await getTwitterUser(twitterOAuthToken.access_token);

  if (!twitterUser) {
    return res.redirect(process.env.TWITTER_CALLBACK_URL);
  }

  const user = await upsertUser(twitterUser);

  if (!user) {
    return res.redirect(process.env.TWITTER_CALLBACK_URL);
  }

  addCookieToRes(res, user, twitterOAuthToken.access_token);

  return res.redirect(process.env.TWITTER_CALLBACK_URL);
}
