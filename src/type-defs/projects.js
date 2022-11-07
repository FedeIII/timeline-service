export default `#graphql
  type Project {
    id: String
    title: String
    date: String
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
    title: String
    description: String
    date: String
    type: EventType
  }

  # QUERIES

  type Query {
    getAllProjects: [Project]
    getProject(
      id: String
      title: String
      date: String
    ): Project
  }

  # MUTATIONS

  input ProjectInput {
    id: String
    title: String
    date: String
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
    title: String
    description: String
    date: String
    type: EventType
  }

  type Mutation {
    createProject(input: ProjectInput): Project
    addEvent(projectId: String, event: EventInput): Project
    deleteProject(id: String): Int
    editEventTitle(
      projectId: String,
      eventId: String,
      title: String
    ): Project
  }
`;