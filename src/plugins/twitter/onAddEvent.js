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
  const { title, description, topic, type } = event;

  function eventIntro(project) {
    let intro = "";

    if (topic && type === "START") {
      intro = `As part of ${project.title}, I've started ${topic}. First, ${title}.`;
    } else if (topic && type === "MIDDLE") {
      intro = title;
    } else if (topic && type === "END") {
      intro = `To finish ${topic}, ${title}`;
    } else if (type === "END_PROJECT") {
      intro = `And finally, to finish ${project.title}: ${title}`;
    } else {
      intro = `Continuing with ${project.title}: ${title}`;
    }

    return intro + titleSeparator(intro);
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
