import { create } from "apisauce";
import { BASE_URL } from "./variables";

export const client = create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const setAuthToken = (authToken) => {
  if (authToken) {
    client.setHeader("Authorization", "Bearer " + authToken);
  } else {
    delete client.auth;
  }
};
