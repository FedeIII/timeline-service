import createProject from "./createProject.js";

export default {
  requestDidStart(requestContext) {
    let operation;

    return {
      didResolveOperation(context) {
        operation = context.operationName;
      },
      willSendResponse(context) {
        switch (operation) {
          case "CreateProject":
            createProject(context.response.body);
            break;

          default:
            break;
        }
      },
    };
  },
};
