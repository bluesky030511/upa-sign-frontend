import { useMutation, useQuery } from "react-query";
import { API_ENDPOINTS } from "../utils/variables";
import http from "../utils/http";
import { getToken } from "../utils/get-token";

// Update user profile
const updateUserProfile = async (input) => {
  const { data } = await http.patch(API_ENDPOINTS.PROFILE, input);
  return data;
};

// Change user password
const changePassword = async (input) => {
  return await http.post(API_ENDPOINTS.CHANGE_PASSWORD, input);
};

// Forgot Password
const forgotPassword = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.FORGOT_PASSWORD, input);
  return data;
};

// Forgot Password Hash
const resetPassword = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.RESET_PASSWORD, input);
  return data;
};

// Contact us
const contactUs = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.CONTACT_US, input);
  return data;
};

// Get User Profile
const getProfile = async (id) => {
  const { data } = await http.get(API_ENDPOINTS.PROFILE, {
    params: {
      id,
    },
  });
  return data;
};

// Get Subscription
const getSubscription = async () => {
  const { data } = await http.get(API_ENDPOINTS.SUBSCRIPTION);
  return data;
};

// Subscribe
const subscribe = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.SUBSCRIPTION, input);
  return data;
};

// Newsletter
const subscribeToNewsletter = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.NEWSLETTER, input);
  return data;
};

export const useUpdateUserProfile = () => {
  return useMutation(updateUserProfile);
};

export const useChangePassword = () => {
  return useMutation((input) => changePassword(input));
};

export const useForgotPassword = () => {
  return useMutation(forgotPassword);
};

export const useResetPassword = () => {
  return useMutation(resetPassword);
};

export const useContactUs = () => {
  return useMutation(contactUs);
};

export const useSubscribeToNewsletter = () => {
  return useMutation(subscribeToNewsletter);
};

export const useGetProfile = ({ id, onSuccess, onError }) => {
  return useQuery("profile", () => getProfile(id), {
    enabled: !!id,
    retry: false,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useGetSubscription = ({
  subscriptionSuccess,
  subscriptionError,
}) => {
  return useQuery("subscription", getSubscription, {
    onSuccess: subscriptionSuccess,
    onError: subscriptionError,
    retry: false,
    enabled: !!getToken(),
  });
};

export const usePostSubscription = () => {
  return useMutation(subscribe);
};
