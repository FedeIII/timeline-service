import onCreateProject from "./onCreateProject.js";
import addEvent from "./addEvent.js";

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
            onCreateProject(
              context.response.body,
              requestContext.contextValue.oauth2_token
            );
            break;

          case "AddEvent":
            // addEvent(
            //   context.response.body,
            //   requestContext.contextValue.oauth2_token
            // );
            break;

          default:
            break;
        }
      },
    };
  },
};
