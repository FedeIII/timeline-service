const MAX_CHARACTERS = 280;

function isFirstTweet(tweetIndex) {
  return tweetIndex === 0;
}

function isSecondTweet(tweetIndex) {
  return tweetIndex === 1;
}

function getVideoUrl(videoUrl) {
  return videoUrl.replace(
    /https:\/\/www.youtube.com\/embed\//,
    "https://youtu.be/"
  );
}

function getImageUrl(imgUrl) {
  return imgUrl;
}

function compileTweets(sentences, videoUrl, imgUrl) {
  const tweets = [];

  let mediaAdded = false;
  let tweetIndex = 0;
  while (sentences.length) {
    const nextTweet = { text: "" };
    let buildingTweet = true;

    if (!mediaAdded && isSecondTweet(tweetIndex)) {
      if (videoUrl) {
        nextTweet.text += getVideoUrl(videoUrl) + " \n\n";
      } else if (imgUrl) {
        nextTweet.text += getImageUrl(imgUrl) + " \n\n";
      }
      mediaAdded = true;
    }

    while (buildingTweet && sentences.length) {
      const nextSentence = sentences[0];

      if ((nextTweet.text + nextSentence).length > MAX_CHARACTERS - 2) {
        buildingTweet = false;
      } else {
        nextTweet.text += sentences.shift().trimEnd();
        if (nextTweet.text.charAt(nextTweet.text.length - 1) !== ".") {
          nextTweet.text += ". ";
        }
      }

      if (isFirstTweet(tweetIndex)) {
        const url = videoUrl ? getVideoUrl(videoUrl) : getImageUrl(imgUrl);
        if (url) {
          if ((nextTweet.text + url).length <= MAX_CHARACTERS) {
            nextTweet.text += url;
            mediaAdded = true;
          }
        }
      }
    }

    nextTweet.text = nextTweet.text.trimEnd();
    tweets.push(nextTweet);

    tweetIndex++;
  }

  return tweets;
}

export function writeTweets(text, textIntro, videoUrl, imgUrl) {
  let textWithIntro = textIntro;
  if (text) textWithIntro += text;
  const sentences = textWithIntro.split(". ");

  return compileTweets(sentences, videoUrl, imgUrl);
}
