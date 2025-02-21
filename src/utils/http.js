import { message } from "antd";
import axios from "axios";

const http = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60 * 1000,
  // headers: {'Content-Type': "application/json"}
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data?.status === "success") {
        return response.data;
      } else {
        message.error(response.data?.message ?? "Request Error");
        return Promise.reject(response.data?.message ?? "Request Error");
      }
    } else {
      message.error(response.data?.message ?? "Request Error");
      return Promise.reject(response.data?.message ?? "Request Error");
    }
  },
  (error) => {
    message.error(error.message ?? "Request Error");
    return Promise.reject(error);
  }
);

export default http;
