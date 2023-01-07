import jwt from "jsonwebtoken";
import { Configuration, OpenAIApi } from "openai";

import resolvers from "../../resolvers/projectResolvers.js";
import { postTweet } from "./utils/postTweet.js";
import { writeTweets } from "./utils/writeTweets.js";
import { firstEventPrompt, projectIntroPrompt } from "./utils/aiPrompts.js";
import { titleSeparator } from "./utils/titleSeparator.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getProjectIntro(project) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: projectIntroPrompt(project),
    temperature: 0.9,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const intro = response.data.choices[0].text.replaceAll("\n", "");
  return intro + titleSeparator(intro);
}

async function getEventIntro(project, projectIntro) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: firstEventPrompt(project, projectIntro),
    temperature: 0.9,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const intro = response.data.choices[0].text.replaceAll("\n", "");
  return intro + titleSeparator(intro);
}

async function postTweetThread(accessToken, project) {
  const { description, events = [] } = project;
  const { description: eventDescription, videoUrl } = events[0] || {};

  const projectIntro = await getProjectIntro(project);
  const eventIntro = await getEventIntro(project, projectIntro);

  const tweets = [
    ...writeTweets(description, projectIntro),
    ...writeTweets(eventDescription, eventIntro, videoUrl),
  ];

  let mainThreadId = null;
  let subThreadId = null;
  for (const tweet of tweets) {
    subThreadId = await postTweet({
      tweet,
      replyTweetId: subThreadId,
      accessToken,
    });
    if (!mainThreadId) mainThreadId = subThreadId;
  }

  return [mainThreadId, subThreadId];
}

export default async function onCreateProject({ project, oauth2_token }) {
  if (!oauth2_token) return;

  try {
    const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

    const [mainThreadId, subThreadId] = await postTweetThread(
      payload.accessToken,
      project
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
