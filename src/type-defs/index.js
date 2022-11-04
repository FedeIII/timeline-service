export default `#graphql
  type Project {
    id: String
    title: String
    date: String
  }

  type Query {
    getAllProjects: [Project]
    getProject(
      id: String
      title: String
      date: String
    ): Project
  }

  input ProjectInput {
    id: String
    title: String
    date: String
  }

  type Mutation {
    createProject(input: ProjectInput): Project
  }
`;
