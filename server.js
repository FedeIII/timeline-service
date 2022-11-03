// import dns from 'node:dns';
import express from 'express';
import * as projectsService from './src/services/projects.js';

// dns.setDefaultResultOrder('ipv4first');

// Constants
const PORT = 8080;
const HOST = 'localhost';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('I\'m alive!!!');
});

app.get('/projects', (req, res) => {
  const projects = projectsService.get();

  res.send(projects);
});

app.get('/projects/:id', (req, res) => {
  const project = projectsService.get(req.params.id);

  res.send(project);
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
