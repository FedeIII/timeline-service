import axios from "axios";
import jwt from "jsonwebtoken";
import format from "date-fns/format/index.js";

import resolvers from "../../resolvers/projectResolvers.js";

const MAX_CHARACTERS = 280;

function projectIntro(date) {
  if (!date) return "";
  return `On ${format(new Date(date), "d LLL yyyy")} I started `;
}

function titleSeparator(title) {
  if (!title) return "";

  if (title.charAt(title.length - 1) === ".") {
    return " ";
  }

  return ". ";
}

function eventIntro(eventTitle) {
  if (!eventTitle) return "";
  const intro = `First thing I did: ${eventTitle}`;
  return intro + titleSeparator(intro);
}

function compileTweets(sentences) {
  const tweets = [];

  while (sentences.length) {
    const nextTweet = { text: "" };
    let buildingTweet = true;

    while (buildingTweet && sentences.length) {
      const nextSentence = sentences[0];

      if ((nextTweet.text + nextSentence).length > 280) {
        buildingTweet = false;
      } else {
        nextTweet.text += sentences.shift();
        if (nextTweet.text.charAt(nextTweet.text.length - 1) !== ".") {
          nextTweet.text += ". ";
        }
      }
    }

    nextTweet.text.trimEnd();
    tweets.push(nextTweet);
  }

  return tweets;
}

function getTweets(project) {
  const { title, description, events = [] } = project || {};
  const {
    date,
    description: eventDescription,
    imgUrl,
    title: eventTitle,
  } = events[0] || {};

  const projectText =
    projectIntro(date) + title + titleSeparator(title) + description;
  const eventText = eventIntro(eventTitle) + eventDescription;

  const projectTextSentences = projectText.split(". ");
  const eventTextSentences = eventText.split(". ");

  return [
    ...compileTweets(projectTextSentences),
    ...compileTweets(eventTextSentences),
  ];
}

async function postTweet(tweet, lastTweetId, accessToken) {
  const replyTweet = {
    ...tweet,
  };

  if (lastTweetId) {
    replyTweet.reply = {
      in_reply_to_tweet_id: lastTweetId,
    };
  }

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      replyTweet,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data.id;
  } catch (error) {
    console.error("error", error.response);
  }
}

async function postTweetThread(oauth2_token, project) {
  const tweets = getTweets(project);

  const payload = await jwt.verify(oauth2_token, process.env.JWT_SECRET);

  let lastTweetId = null;
  let firstTeetId = null;
  for (const tweet of tweets) {
    lastTweetId = await postTweet(tweet, lastTweetId, payload.accessToken);
    if (!firstTeetId) firstTeetId = lastTweetId;
  }

  return [firstTeetId, lastTweetId];
}

export default async function onCreateProject(responseBody, oauth2_token) {
  if (!oauth2_token) return;

  const project = responseBody.singleResult.data.createProject;

  try {
    const [firstTweetId, lastTweetId] = await postTweetThread(
      oauth2_token,
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