import jwt from "jsonwebtoken";

import resolvers from "../../resolvers/projectResolvers.js";
import { postTweet } from "./utils/postTweet.js";
import { writeTweets } from "./utils/writeTweets.js";

function titleSeparator(title) {
  if (!title) return "";

  if (title.charAt(title.length - 1) === ".") {
    return " ";
  }

  return ". ";
}

async function postNewTweets(project, event, accessToken) {
  const { description, topic, type, id } = event;

  function eventIntro(project) {
    const event = project.events.find((e) => e.id === id);
    return `Continuing with ${project.title}: ${event.title}${titleSeparator(
      event.title
    )}`;
  }

  const tweets = writeTweets(description, project, eventIntro);

  const [firstTweet, ...restTweets] = tweets;

  let tweetId;
  if (topic && type !== "START") {
    tweetId = await postTweet({
      tweet: firstTweet,
      replyTweetId: project.twitter.subThreadId,
      accessToken,
    });
  } else {
    tweetId = await postTweet({
      tweet: firstTweet,
      quoteTweetId: project.twitter.mainThreadId,
      accessToken,
    });
  }

  const firstTweetId = tweetId;

  for (const tweet of restTweets) {
    tweetId = await postTweet({
      tweet,
      replyTweetId: tweetId,
      accessToken,
    });
  }

  return [firstTweetId, tweetId];
}

export default async function onAddEvent({ project, event, oauth2_token }) {
  if (!oauth2_token) return;

  try {
    const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

    const [mainThreadId, subThreadId] = await postNewTweets(
      project,
      event,
      payload.accessToken
    );

    resolvers.Mutation.editProject(null, {
      id: project.id,
      input: {
        twitter: {
          mainThreadId,
          subThreadId,
        },
      },
    });
  } catch (error) {
    console.error(error.message);
  }
}
