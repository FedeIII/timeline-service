import createProject from "./createProject.js";

export default {
  requestDidStart(requestContext) {
    console.log("contextValue", requestContext.contextValue);
    let operation;

    return {
      didResolveOperation(context) {
        operation = context.operationName;
      },
      willSendResponse(context) {
        switch (operation) {
          case "CreateProject":
            console.log("tweet create project");
            createProject(
              context.response.body,
              requestContext.contextValue.oauth2_token
            );
            break;

          default:
            break;
        }
      },
    };
  },
};
