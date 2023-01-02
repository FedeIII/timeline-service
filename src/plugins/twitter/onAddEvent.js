import jwt from "jsonwebtoken";

import resolvers from "../../resolvers/projectResolvers.js";
import { postTweet } from "./utils/postTweet.js";
import { writeTweets } from "./utils/writeTweets.js";

function eventIntro(project) {
  return `Continuing with ${project.title}: `;
}

async function postNewTweets(project, event, accessToken) {
  const { description } = event;
  const tweets = writeTweets(description, project, eventIntro);

  const firstTweetId = project.twitter.firstTweetId;
  let lastTweetId = firstTweetId;
  for (const tweet of tweets) {
    lastTweetId = await postTweet(tweet, lastTweetId, accessToken);
  }

  return [firstTweetId, lastTweetId];
}

export default async function onAddEvent({ project, event, oauth2_token }) {
  if (!oauth2_token) return;

  try {
    const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

    const [firstTweetId, lastTweetId] = await postNewTweets(
      project,
      event,
      payload.accessToken
    );

    resolvers.Mutation.editProject(null, {
      id: project.id,
      input: {
        twitter: {
          firstTweetId,
          lastTweetId,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
  }
}
