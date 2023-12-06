import axios from "axios";
import { getToken } from "./get-token";
import { BASE_URL } from "./variables";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 40000,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setBearerToken = (token) => {
  http.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
    };
    return config;
  });
};

export default http;
