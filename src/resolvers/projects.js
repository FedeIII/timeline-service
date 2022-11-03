import fs from 'fs';
import path from 'path';

const projectsDirectory = path.join(process.cwd(), 'db/projects');

function getAllProjects() {
  const fileNames = fs.readdirSync(projectsDirectory);
  const projects = fileNames.map((fileName) => {

    const id = fileName.replace(/\.json$/, '');
    const fullPath = path.join(projectsDirectory, fileName);
    const rawdata = fs.readFileSync(fullPath, 'utf8');
    const fileContents = JSON.parse(rawdata);

    return {
      id,
      ...fileContents,
    };
  });

  return projects;
}

function getSortedProjects() {
  const projects = getAllProjects();

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
  const projects = getAllProjects();

  const project = projects.find(
    proj => Object.entries(projectParams).reduce(
      (isMatch, [key, value]) => isMatch && proj[key] == value,
      true,
    )
  )

  return project;
}

export default {
  projects: getSortedProjects,
  project: getProject,
}
