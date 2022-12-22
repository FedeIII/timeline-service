// import createProject from "./createProject.js";

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
            console.log('tweet create project');
            // createProject(context.response.body);
            break;

          default:
            break;
        }
      },
    };
  },
};
