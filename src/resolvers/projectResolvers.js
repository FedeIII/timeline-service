import { v4 as uuid } from "uuid";

import { Project } from "../db-connector.js";

// QUERIES

function getUnsortedProjects(userId) {
  return new Promise((resolve, reject) => {
    Project.find({ userId }).exec((err, projects) => {
      if (err) reject(err);
      else resolve(projects);
    });
  });
}

async function getSortedProjects(_, projectParams) {
  const projects = await getUnsortedProjects(projectParams.userId);

  const sortedProjects = projects.sort(
    ({ events: eventsA }, { events: eventsB }) => {
      if (!eventsA[0]) return 1;
      if (!eventsB[0]) return -1;
      if (eventsA[0].date < eventsB[0].date) {
        return 1;
      } else if (eventsA[0].date > eventsB[0].date) {
        return -1;
      } else {
        return 0;
      }
    }
  );

  return sortedProjects;
}

function getProject(_, projectParams) {
  return new Promise((resolve, reject) => {
    Project.findOne(projectParams).exec((err, project) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

// MUTATIONS

function sortProjectEvents(projectId) {
  return Project.findOneAndUpdate(
    { id: projectId },
    { $push: { events: { $each: [], $sort: { date: 1 } } } },
    { new: true }
  );
}

function sortEvents(events) {
  return events.sort((event1, event2) => (event1.date > event2.date ? 1 : -1));
}

function createProject(_, { input }) {
  if (!input.id) throw new Error("Project ID is required");
  if (!input.userId) throw new Error("Project user ID is required");
  if (!input.title) throw new Error("Project title is required");
  if (
    !input.events ||
    !input.events[0] ||
    !input.events[0].date ||
    !input.events[0].title
  )
    throw new Error("Project first event is required");

  const project = new Project({
    id: input.id,
    userId: input.userId,
    title: input.title,
    description: input.description,
    tags: input.tags,
    events: sortEvents(input.events),
  });

  return new Promise((resolve, reject) => {
    project.save((err) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

function editProject(_, { id, input }) {
  let projectData = input;
  if (input.events) {
    projectData = {
      ...projectData,
      events: sortEvents(projectData.events),
    };
  }
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate({ id }, { $set: projectData }, { new: true }).exec(
      (err, project) => {
        if (err) reject(err);
        else resolve(project);
      }
    );
  });
}

async function addEvent(_, { projectId, event }) {
  const id = event.id || uuid();
  await Project.updateOne(
    { id: projectId },
    {
      $push: {
        events: { ...event, id },
      },
    }
  );

  return new Promise((resolve, reject) => {
    sortProjectEvents(projectId).exec((err, project) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

async function deleteProject(_, { id }) {
  const { deletedCount } = await Project.deleteOne({ id });
  return deletedCount;
}

async function editEvent(_, { projectId, eventId, eventProps }) {
  const updateProps = Object.entries(eventProps).reduce(
    (acc, [propName, propValue]) => ({
      ...acc,
      [`events.$.${propName}`]: propValue,
    }),
    {}
  );

  await Project.findOneAndUpdate(
    {
      id: projectId,
      "events.id": eventId,
    },
    {
      $set: updateProps,
    }
  );

  return new Promise((resolve, reject) => {
    sortProjectEvents(projectId).exec((err, project) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

async function deleteEvent(_, { projectId, eventId }) {
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      { id: projectId },
      { $pull: { events: { id: eventId } } },
      { new: true }
    ).exec((err, project) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

async function deleteTag(_, { projectId, tagLabel }) {
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate(
      { id: projectId },
      { $pull: { tags: { label: tagLabel } } },
      { new: true }
    ).exec((err, project) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

export default {
  Query: {
    getAllProjects: getSortedProjects,
    getProject,
  },

  Mutation: {
    createProject,
    createProjectPublic: createProject,
    editProject,
    deleteProject,
    // events
    addEvent,
    addEventPublic: addEvent,
    editEvent,
    deleteEvent,
    // tags
    deleteTag,
  },
};
