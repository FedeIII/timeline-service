import axios from "axios";
import jwt from "jsonwebtoken";

export default async function addEvent(responseBody, oauth2_token) {
  const project = responseBody.singleResult.data.addEvent;
  const { description } = project;

  console.log("tweeting", description);

  const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      {
        text: description,
      },
      {
        headers: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      }
    );
    console.log("tweeted!", response);
  } catch (error) {
    console.error("error", error.response);
  }
}
