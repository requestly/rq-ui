import { trackEvent } from "../common";

export const trackPageURlModifiedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("rule_source_pageUrl_filter_modified", params);
};

export const trackResourceTypeModifiedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("rule_source_resourceType_filter_modified", params);
};

export const trackRequestMethodModifiedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("rule_source_requestMethod_filter_modified", params);
};

export const trackRequestPayloadKeyModifiedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("request_payload_key_modified", params);
};

export const trackRequestPayloadValueModifiedEvent = (rule_type) => {
  const params = {
    rule_type,
  };
  trackEvent("request_payload_value_modified", params);
};
