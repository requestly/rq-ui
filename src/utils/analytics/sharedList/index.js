import { trackEvent } from "../common";

export const trackSharedListCreatedEvent = (num_rules, source, page) => {
  const params = {
    num_rules,
    source,
    page,
  };
  trackEvent("sharedList_created", params);
};

export const trackSharedListWorkflowStartedEvent = (
  num_rules,
  source,
  page
) => {
  const params = {
    num_rules,
    source,
    page,
  };
  trackEvent("sharedList_creation_workflow_started", params);
};

export const trackSharedListLimitReachedEvent = (num) => {
  const params = { num };
  trackEvent("sharedList_limit_reached", params);
};
