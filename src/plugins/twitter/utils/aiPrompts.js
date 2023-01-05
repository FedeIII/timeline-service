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
  )}\n${
    topicList ? `- The project topics are ${topicList}.\n` : ""
  }Write it in first person as if you were the only author.`;
}

export function firstEventPrompt(project, projectIntro) {
  const { events } = project;
  const { title } = events[0] || {};

  return `Continue this intro:\n\"${projectIntro}\"\nwith a simple sentence about the first step of the project, called \"${title.toLowerCase()}\"`;
}

function startEventPrompt(project, event) {
  return `For a twitter account used to present personal projects, write a simple intro sentence for the next process of the project. The project is called ${
    project.title
  }, the process is called ${event.topic.toLowerCase()}, and the first step of the process is titled ${
    event.title
  }. Do not add anything else like location, etc). Write it in first person as if you were the only author.`;
}

function middleEventPrompt(project, event) {
  return `For a twitter account used to present personal projects, write a simple intro sentence for the next step of a process of the project. The project is called ${project.title}, the process is called ${event.topic}, and the next step of the process is titled ${event.title}. Do not add anything else like location, etc). Write it in first person as if you were the only author.`;
}

function endEventPrompt(project, event) {
  return `For a twitter account used to present personal projects, write a simple intro sentence for the final step of a process of the project. The project is called ${project.title}, the process is called ${event.topic}, and the final step of the process is titled ${event.title}. Do not add anything else like location, etc). Write it in first person as if you were the only author.`;
}

function endProjectPrompt(project, event) {
  return `For a twitter account used to present personal projects, write a simple intro sentence for the final step of the project. The project is called ${project.title} and the final step is titled ${event.title}. Do not add anything else like location, etc). Write it in first person as if you were the only author.`;
}

function promptEventPrompt(project, event) {
  return `For a twitter account used to present personal projects, write a simple intro sentence for the next step of the project. The project is called ${project.title} and the next step is titled ${event.title}. Do not add anything else like location, etc). Write it in first person as if you were the only author.`;
}

export function eventIntroPrompt(project, event) {
  const { title, topic, type } = event;

  let prompt = `Continuing with ${project.title}: ${title}`;

  if (topic && type === "START") {
    prompt = startEventPrompt(project, event);
  } else if (topic && type === "MIDDLE") {
    prompt = middleEventPrompt(project, event);
  } else if (topic && type === "END") {
    prompt = endEventPrompt(project, event);
  } else if (type === "END_PROJECT") {
    prompt = endProjectPrompt(project, event);
  } else {
    prompt = promptEventPrompt(project, event);
  }

  return prompt;
}
