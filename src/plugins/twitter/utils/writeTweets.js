const MAX_CHARACTERS = 280;

function getVideoUrl(videoUrl) {
  return videoUrl.replace(
    /https:\/\/www.youtube.com\/embed\//,
    "https://youtu.be/"
  );
}

function getImageUrl(imgUrl) {
  return imgUrl;
}

function divideSentence(sentence) {
  // Try dividing by new lines
  let dividedSentence = sentence.split("\n").filter((s) => s && s !== "");

  // Then by last comma before max characters
  if (dividedSentence.length < 2) {
    const indexOfLastCommaBeforeMaxChar = sentence
      .substring(0, MAX_CHARACTERS - 2)
      .lastIndexOf(", ");
    dividedSentence = [
      sentence.substring(0, indexOfLastCommaBeforeMaxChar),
      sentence.substring(indexOfLastCommaBeforeMaxChar + 1),
    ];
  }

  return dividedSentence.filter((s) => s && s !== "");
}

function compileTweets(sentences, videoUrl, imgUrl) {
  const tweets = [];

  let mediaAdded = false;

  // Build thread loop while there are sentences left
  while (sentences.length) {
    const nextTweet = { text: "" };
    let buildingTweet = true;

    // Build tweet loop while no max characters, there are sentences left,
    // and the media has been added
    while (buildingTweet && sentences.length && !mediaAdded) {
      const nextSentence = sentences[0];

      if ((nextTweet.text + nextSentence).length > MAX_CHARACTERS - 2) {
        // Max characters for a tweet reached
        buildingTweet = false;
      } else {
        // Add the next sentence to the tweet
        nextTweet.text += sentences.shift().trimEnd();
        if (nextTweet.text.charAt(nextTweet.text.length - 1) !== ".") {
          nextTweet.text += ". ";
        }
      }

      // Add media at the end of the thread (last tweet with other text if it
      // fits on in a separate one)
      if (sentences.length === 0) {
        const url = videoUrl ? getVideoUrl(videoUrl) : getImageUrl(imgUrl);
        if (url) {
          if ((nextTweet.text + url).length <= MAX_CHARACTERS - 2) {
            if (
              nextTweet.text.length &&
              nextTweet.text.charAt(nextTweet.text.length - 1) !== " "
            ) {
              nextTweet.text += " ";
            }
            nextTweet.text += url;
            mediaAdded = true;
          }
        }
      }
    }

    nextTweet.text = nextTweet.text.trimEnd();

    // if the next sentence is too long for a tweet
    if (nextTweet.text === "") {
      // divide it
      const [nextSentence, ...restSentences] = sentences;
      sentences = [...divideSentence(nextSentence), ...restSentences];
    } else {
      // add the tweet to the thread
      tweets.push(nextTweet);
    }
  }

  return tweets;
}

export function writeTweets(text, textIntro, videoUrl, imgUrl) {
  let textWithIntro = textIntro;
  if (text) textWithIntro += text;
  const sentences = textWithIntro.split(". ");

  return compileTweets(sentences, videoUrl, imgUrl);
}
