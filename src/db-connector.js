import mongoose from 'mongoose';
import { environment } from './app-config.js';
import { projectSchema } from './schema/projectSchema.js';

const env = process.env.NODE_ENV || "development";

mongoose.Promise = Promise;

console.log('connecting...');
await mongoose.connect(environment[env].dbString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('error', () => {
    console.error("Error while connecting to DB");
});

console.log('connected!');

const Project = mongoose.model('Project', projectSchema);

export { Project };