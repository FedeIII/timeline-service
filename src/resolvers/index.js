import projectResolvers from './projectResolvers.js';

function mergeResolvers(...resolvers) {
  return resolvers.reduce((mergedResolvers, nextResolvers) => ({
    Query: {
      ...mergedResolvers.Query,
      ...nextResolvers.Query,
    },
    Mutation: {
      ...mergedResolvers.Mutation,
      ...nextResolvers.Mutation,
    },
  }), {
    Query: {},
    Mutation: {},
  });
}

const resolvers = mergeResolvers(
  projectResolvers,
);

export default resolvers;