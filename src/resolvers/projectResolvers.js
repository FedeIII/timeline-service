import { Project } from '../db-connector.js'

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

function createProject(_, { input }) {
  const project = new Project({
    id: input.id,
    title: input.title,
    date: input.date,
  });

  return new Promise((resolve, reject) => {
    project.save((err) => {
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
  }
}
