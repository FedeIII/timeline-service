export default `#graphql
  type Project {
    id: String
    title: String
    description: String
    tags: [Tag]
    events: [Event]
    twitter: Twitter
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

  type Twitter {
    mainThreadId: String
    subThreadId: String
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
    twitter: TwitterInput
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

  input TwitterInput {
    mainThreadId: String
    subThreadId: String
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
    deleteTag(projectId: String!, tagLabel: String!): Project
  }
`;
