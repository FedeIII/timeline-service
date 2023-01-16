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
          case "CreateProjectPublic":
            onCreateProject({
              project: context.response.body.singleResult.data.createProjectPublic,
              oauth2_token: requestContext.contextValue.oauth2_token,
            });
            break;

          case "AddEventPublic":
            onAddEvent({
              project: context.response.body.singleResult.data.addEventPublic,
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
