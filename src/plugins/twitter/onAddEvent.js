import jwt from "jsonwebtoken";
import { Configuration, OpenAIApi } from "openai";

import resolvers from "../../resolvers/projectResolvers.js";
import { postTweet } from "./utils/postTweet.js";
import { titleSeparator } from "./utils/titleSeparator.js";
import { writeTweets } from "./utils/writeTweets.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getEventIntro(project, event) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: eventIntroPrompt(project, event),
    temperature: 0.9,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const intro = response.data.choices[0].text.replace("\n", "");
  return intro + titleSeparator(intro);
}

async function postNewTweets(project, event, accessToken) {
  const { title, description, topic, type } = event;

  const textIntro = await getEventIntro(project, event);

  const tweets = writeTweets(description, textIntro);

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
