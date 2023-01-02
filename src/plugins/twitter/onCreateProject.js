import jwt from "jsonwebtoken";
import format from "date-fns/format/index.js";

import resolvers from "../../resolvers/projectResolvers.js";
import { postTweet } from "./utils/postTweet.js";
import { writeTweets } from "./utils/writeTweets.js";

function dateIntro(date) {
  if (!date) return "";
  return `On ${format(new Date(date), "d LLL yyyy")}, I started `;
}

function titleSeparator(title) {
  if (!title) return "";

  if (title.charAt(title.length - 1) === ".") {
    return " ";
  }

  return ". ";
}

function projectIntro(project) {
  const { title, events = [] } = project;
  const { date } = events[0] || {};
  return dateIntro(date) + title + titleSeparator(title);
}

function eventIntro(project) {
  const { events = [] } = project;
  const { title: eventTitle } = events[0] || {};
  if (!eventTitle) return "";
  const intro = `First thing I did: ${eventTitle}`;
  return intro + titleSeparator(intro);
}

async function postTweetThread(accessToken, project) {
  const { description, events = [] } = project;
  const { description: eventDescription } = events[0] || {};

  const tweets = [
    ...writeTweets(description, project, projectIntro),
    ...writeTweets(eventDescription, project, eventIntro),
  ];

  let firstTweetId = null;
  let lastTweetId = null;
  for (const tweet of tweets) {
    lastTweetId = await postTweet(tweet, lastTweetId, accessToken);
    if (!firstTweetId) firstTweetId = lastTweetId;
  }

  return [firstTweetId, lastTweetId];
}

export default async function onCreateProject({ project, oauth2_token }) {
  if (!oauth2_token) return;

  try {
    const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

    const [firstTweetId, lastTweetId] = await postTweetThread(
      payload.accessToken,
      project
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
