import { message } from "antd";

export const toast = {};

message.config({
  maxCount: 2,
});

toast.success = (messageText) => {
  message.success(messageText);
};
toast.info = (messageText) => {
  message.info(messageText);
};
toast.error = (messageText) => {
  message.error(messageText);
};
toast.warn = (messageText) => {
  message.warn(messageText);
};
toast.loading = (messageText) => {
  message.loading(messageText);
};
