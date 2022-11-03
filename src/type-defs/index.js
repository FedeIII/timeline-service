export default `#graphql
  type Project {
    id: String
    title: String
    date: String
  }

  type Query {
    projects: [Project]
    project(
      id: String
      title: String
      date: String
    ): Project
  }
`;
