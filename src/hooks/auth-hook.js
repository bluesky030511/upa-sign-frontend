import { useMutation } from "react-query";
import { API_ENDPOINTS } from "../utils/variables";
import http from "../utils/http";

// Register
const register = async (uData) => {
  const { data } = await http.post(API_ENDPOINTS.REGISTER, uData);
  return data;
};

// Login
const login = async (uData) => {
  const { data } = await http.post(API_ENDPOINTS.LOGIN, uData);
  return data;
};

export const useRegister = () => {
  return useMutation(register);
};

export const useLogin = () => {
  return useMutation(login);
};
