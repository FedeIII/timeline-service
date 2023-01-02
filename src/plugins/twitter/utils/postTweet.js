import axios from "axios";

export async function postTweet(tweet, lastTweetId, accessToken) {
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
    console.error("error:", error.message, error.response.data.errors);
  }
}
