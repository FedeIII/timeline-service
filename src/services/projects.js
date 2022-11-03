import fs from 'fs';
import path from 'path';

const projectsDirectory = path.join(process.cwd(), 'db/projects');

export function get(id) {
  if (id) {
    return getProject(id);
  }

  return getAllProjects();
}

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

function getProject(id) {
  const fullPath = path.join(projectsDirectory, `${id}.json`);
  const rawdata = fs.readFileSync(fullPath, 'utf8');
  const project = JSON.parse(rawdata);

  return {
    id,
    ...project,
  };
}

