function compileTweets(sentences) {
  const tweets = [];

  while (sentences.length) {
    const nextTweet = { text: "" };
    let buildingTweet = true;

    while (buildingTweet && sentences.length) {
      const nextSentence = sentences[0];

      if ((nextTweet.text + nextSentence).length > 278) {
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

export function writeTweets(text, project, textIntro) {
  const textWithIntro = textIntro(project) + text;
  const sentences = textWithIntro.split(". ");

  return compileTweets(sentences);
}
