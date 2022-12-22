import request from "../../request.js";

export default async function createProject(responseBody) {
  const project = responseBody.singleResult.data.createProject;
  const { description } = project;

  console.log("tweeting", description);
  try {
    const response = await request.post("tweets", {
      text: description,
    });
    console.log("tweeted!", response);
  } catch (error) {
    console.error("error", error.response);
  }
}
