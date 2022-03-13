import {
  COMPONENTS as GLOBAL_COMPONENTS,
  CONFIG as GLOBAL_CONFIG,
} from "git@github.com:requestly/requestly.git";

const { LOGGER } = GLOBAL_COMPONENTS;

const PageScriptMessageHandler = {
  eventCallbackMap: {},
  requestId: 1,

  constants: {
    CONTENT_SCRIPT: "content_script",
    PAGE_SCRIPT: "page_script",
    DOMAIN: GLOBAL_CONFIG.WEB_URL,
    SOURCE_FIELD: "source",
  },

  addMessageListener: function () {
    window.addEventListener("message", this.handleMessageReceived.bind(this));
  },

  getSource: function () {
    return this.constants.PAGE_SCRIPT;
  },

  registerCallback: function (message, callback) {
    if (!callback) return;

    // Message has requestId when we are sending response
    const requestIdToUse = this.requestId++;
    this.eventCallbackMap[message.action + "_" + requestIdToUse] = callback;
    message.requestId = requestIdToUse;
  },

  invokeCallback: function (data) {
    const callbackRef = this.eventCallbackMap[
      data.action + "_" + data.requestId
    ];

    if (typeof callbackRef === "function") {
      // We should remove the entry from map first before executing the callback otherwise we will store stale references of functions
      delete this.eventCallbackMap[data.action];
      callbackRef.call(this, data.response);
    }
  },

  sendMessage: function (message, callback) {
    if (!message.action) {
      LOGGER.error("Invalid message. Must contain some action");
      return;
    }

    this.registerCallback(message, callback);

    message[this.constants.SOURCE_FIELD] = this.getSource();
    window.postMessage(message, this.constants.DOMAIN);
  },

  sendResponse: function (originalEventData, response) {
    const message = {
      action: originalEventData.action,
      requestId: originalEventData.requestId,
      response: response,
    };

    message[this.constants.SOURCE_FIELD] = this.constants.PAGE_SCRIPT;
    window.postMessage(message, this.constants.DOMAIN);
  },

  handleMessageReceived: function (event) {
    if (event && event.origin !== this.constants.DOMAIN) {
      if (GLOBAL_COMPONENTS.logLevel === "debug") {
        console.log(
          "Ignoring message from the following domain",
          event.origin,
          event.data
        );
      }

      return;
    }

    if (
      event &&
      event.data &&
      event.data.source === this.constants.CONTENT_SCRIPT
    ) {
      GLOBAL_COMPONENTS.logLevel === "debug" &&
        console.log("Received message:", event.data);

      this.invokeCallback(event.data);
    }
  },

  init: function () {
    // Handle Backward compatibility
    // We have updated domain to .io in newer version of extensions but older extension versions
    // will still try to send message to .in So this script is essentially running in .in page
    // Hence, we should post message to .in instead of .io (as per config)
    // To fix this Modify the config when this script is running in .in domain
    // To be removed after June
    if (
      window.location.hostname.indexOf("requestly.in") !== -1 &&
      this.constants.DOMAIN.indexOf("requestly.io") !== -1
    ) {
      this.constants.DOMAIN = this.constants.DOMAIN.replace(".io", ".in");
    }

    this.addMessageListener();
  },
};

export default PageScriptMessageHandler;
