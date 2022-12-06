export default `#graphql
  type Project {
    id: String
    title: String
    description: String
    tags: [Tag]
    events: [Event]
  }

  type Tag {
    type: String
    label: String
  }

  enum EventType {
    START_PROJECT
    PROMPT
    START
    MIDDLE
    END
    END_PROJECT
  }

  type Event {
    id: String
    imgUrl: String
    videoUrl: String
    title: String
    description: String
    date: String
    type: EventType
    topic: String
  }

  # QUERIES

  type Query {
    getAllProjects: [Project]
    getProject(
      id: String
      title: String
    ): Project
  }

  # MUTATIONS

  input ProjectInput {
    id: String
    title: String
    description: String
    tags: [TagInput]
    events: [EventInput]
  }

  input TagInput {
    type: String
    label: String
  }

  input EventInput {
    id: String
    imgUrl: String
    videoUrl: String
    title: String
    description: String
    date: String
    type: EventType
    topic: String
  }

  type Mutation {
    createProject(input: ProjectInput): Project
    addEvent(projectId: String, event: EventInput): Project
    editProject(id: String!, input: ProjectInput!): Project
    deleteProject(id: String): Int
    editEvent(
      projectId: String,
      eventId: String,
      eventProps: EventInput
    ): Project
    deleteEvent(projectId: String!, eventId: String!): Project
  }
`;
