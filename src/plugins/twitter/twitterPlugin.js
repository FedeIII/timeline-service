import onCreateProject from "./onCreateProject.js";
import onAddEvent from "./onAddEvent.js";

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
            onCreateProject({
              project: context.response.body.singleResult.data.createProject,
              oauth2_token: requestContext.contextValue.oauth2_token,
            });
            break;

          case "AddEvent":
            onAddEvent({
              project: context.response.body.singleResult.data.addEvent,
              event: requestContext.request.variables.event,
              oauth2_token: requestContext.contextValue.oauth2_token,
            });
            break;

          default:
            break;
        }
      },
    };
  },
};
