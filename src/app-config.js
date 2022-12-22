export const PORT = 8080;
export const environment = {
  serverURL: `http://localhost:${PORT}/`,
  dbString: process.env.MONGODB_URI,
};
