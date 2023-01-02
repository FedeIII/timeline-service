import axios from "axios";

export async function postTweet({
  tweet,
  replyTweetId,
  quoteTweetId,
  accessToken,
}) {
  const tweetPayload = {
    ...tweet,
  };

  if (replyTweetId) {
    tweetPayload.reply = {
      in_reply_to_tweet_id: replyTweetId,
    };
  }

  if (quoteTweetId) {
    tweetPayload.quote_tweet_id = quoteTweetId;
  }

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      tweetPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data.id;
  } catch (error) {
    console.error("error:", error.message, error.response.data.errors);
  }
}
