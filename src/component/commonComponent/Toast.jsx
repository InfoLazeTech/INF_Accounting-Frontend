import { message } from "antd";

const Toast = {
  success: (content) => message.open({ type: "success", content }),
  error: (content) => message.open({ type: "error", content }),
  warning: (content) => message.open({ type: "warning", content }),
  info: (content) => message.open({ type: "info", content }),
};

export default Toast;
