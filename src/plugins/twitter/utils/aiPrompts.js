import format from "date-fns/format/index.js";

export function projectIntroPrompt(project) {
  const { title, events, topics } = project;
  const { date } = events[0] || {};

  let topicList;
  if (topics && topics.length) {
    const [lastTopic, ...restTopics] = topics.reverse();
    topicList = [...restTopics.reverse().map((t) => t.label.toLowerCase())]
      .join(", ")
      .concat(`, and ${lastTopic.label.toLowerCase()}`);
  }

  return `For a twitter account used to present personal projects, write a simple sentence to introduce one using only the following information (do not add anything else like location, etc):\n- The project is called \"${title}\"\n- It started on ${format(
    new Date(date),
    "d LLLL, yyyy"
  )}\n${topicList ? `- The project topics are ${topicList}.\n` : ''}Write it in first person as if you were the only author.`;
}

export function firstEventPrompt(project, projectIntro) {
  const { events } = project;
  const { title } = events[0] || {};

  return `Continue this intro:\n\"${projectIntro}\"\nwith a simple sentence about the first step of the project, called \"${title.toLowerCase()}\"`;
}
