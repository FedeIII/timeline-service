import mongoose from 'mongoose';
import { Project } from '../db-connector.js'

// QUERIES

function getUnsortedProjects() {
  return new Promise((resolve, reject) => {
    Project.find((err, projects) => {
      if (err) reject(err);
      else resolve(projects);
    })
  });
}

async function getSortedProjects() {
  const projects = await getUnsortedProjects();

  const sortedProjects = projects.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });

  return sortedProjects
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

function createProject(_, { input }) {
  const project = new Project({
    id: input.id,
    title: input.title,
    date: input.date,
    description: input.description,
    tags: input.tags,
    events: input.events,
  });

  return new Promise((resolve, reject) => {
    project.save((err) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

function editProject(_, { id, input }) {
  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate({ id }, input)
      .exec((err, project) => {
        if (err) reject(err);
        else resolve(project);
      });
  });
}

async function addEvent(_, { projectId, event }) {
  const project = await getProject(_, { id: projectId });

  return new Promise((resolve, reject) => {
    const newEvents = [...project.events, event];
    Project.updateOne(
      { id: projectId },
      { events: newEvents },
    ).exec((err, _) => {
      if (err) reject(err);
      else resolve(project);
    });
  });
}

async function deleteProject(_, { id }) {
  const { deletedCount } = await Project.deleteOne({ id })
  return deletedCount;
}

async function editEvent(_, { projectId, eventId, eventProps }) {
  const updateProps = Object.entries(eventProps).reduce((acc, [propName, propValue]) => ({
    '$set': {
      ...acc['$set'],
      [`events.$.${propName}`]: propValue,
    },
  }), { '$set': {} });

  return new Promise((resolve, reject) => {
    Project.findOneAndUpdate({
      id: projectId,
      'events.id': eventId
    },
      updateProps
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
    editProject,
    deleteProject,
    // events
    addEvent,
    editEvent,
  }
}
