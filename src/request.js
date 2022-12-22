import axios from "axios";
import { Token } from "./db-connector.js";

const request = axios.create({
  baseURL: "https://api.twitter.com/",
  timeout: 1000,
});

(async function () {
  console.log("getting token...");

  let tokenValue = await new Promise((resolve, reject) => {
    Token.findOne({ type: "TWITTER" }).exec((err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token && token.value);
      }
    });
  });

  if (!tokenValue) {
    console.log("no token found, requesting new one...");

    const response = await request.post(
      "oauth2/token",
      {},
      {
        auth: {
          username: process.env.API_KEY,
          password: process.env.API_KEY_SECRET,
        },
        params: {
          grant_type: "client_credentials",
        },
      }
    );

    tokenValue = `Bearer ${Buffer.from(response.data.access_token).toString(
      "base64"
    )}`;

    console.log("new token", tokenValue);

    console.log("saving token...");
    const token = new Token({
      type: "TWITTER",
      value: tokenValue,
    });
    token.save();
    console.log("token saved");
  }

  request.defaults.headers.common["Authorization"] = tokenValue;

  console.log("set header Authorization", tokenValue);
})();

export default request;
