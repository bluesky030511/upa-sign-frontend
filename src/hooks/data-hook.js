import { useMutation, useQuery } from "react-query";
import { API_ENDPOINTS } from "../utils/variables";
import http from "../utils/http";

//Get All Contracts
const getContracts = async () => {
  const { data } = await http.get(API_ENDPOINTS.CONTRACT);
  return data;
};

// Get Contract by id
const getContractById = async (id) => {
  const { data } = await http.get(`${API_ENDPOINTS.CONTRACT}/${id}/invite`);
  return data;
};

// Delete Contract
const deleteContract = async (id) => {
  const { data } = await http.delete(`${API_ENDPOINTS.CONTRACT}/${id}`);
  return data;
};

// File Preview
const getFilePreview = async (id) => {
  const { data } = await http.get(`${API_ENDPOINTS.FILE}/f/view/preview.pdf`, {
    params: {
      id,
    },
    responseType: "blob",
  });
  return data;
};

// Invite customer to contracts
const inviteCustomer = async ({ id, input }) => {
  const { data } = await http.post(
    `${API_ENDPOINTS.CONTRACT}/${id}/invite`,
    input
  );
  return data;
};

//Create New Contract
const createContract = async (uData) => {
  const { data } = await http.post(API_ENDPOINTS.CONTRACT, uData);
  return data;
};

// Get Templates
const getTemplates = async () => {
  const { data } = await http.get(API_ENDPOINTS.TEMPLATE);
  return data;
};

// Sign Contract
const signContract = async (input) => {
  const { data } = await http.post(
    `${API_ENDPOINTS.CONTRACT}/${input.contractId}/invite/${input.inviteId}/status`,
    input.data
  );
  return data;
};

// Upload template
const uploadTemplate = async (input) => {
  const { data } = await http.post(API_ENDPOINTS.TEMPLATE, input);
  return data;
};

// Delete template
const deleteTemplate = async (id) => {
  const { data } = await http.delete(`${API_ENDPOINTS.TEMPLATE}/${id}`);
  return data;
};
export const useGetContracts = () => {
  return useQuery("get-contracts", getContracts, {
    retry: false,
  });
};

export const useCreateContract = () => {
  return useMutation(createContract);
};

export const useGetContractById = (id) => {
  return useQuery("get-contract-by-id", () => getContractById(id));
};

export const useDeleteContract = () => {
  return useMutation(deleteContract);
};

export const useGetFilePreview = (id) => {
  return useQuery("file-preview", () => getFilePreview(id));
};

export const useInviteCustomer = () => {
  return useMutation(inviteCustomer);
};

export const useGetTemplates = () => {
  return useQuery("templates", getTemplates);
};

export const useSignContract = () => {
  return useMutation(signContract);
};

export const useUploadTemplate = () => {
  return useMutation(uploadTemplate);
};

export const useDeleteTemplate = () => {
  return useMutation(deleteTemplate);
};

export const getPlaceholders = async () => {
  const { data } = await http.get(API_ENDPOINTS.PLACEHOLDER);
  return data;
};

export const useGetPlaceholders = () => {
  return useQuery("placeholders", getPlaceholders);
};

export const createPlaceholder = async (userData) => {
  const { data } = await http.post(API_ENDPOINTS.PLACEHOLDER, userData);
  return data;
};

export const useCreatePlaceholder = () => {
  return useMutation(createPlaceholder);
};

export const updatePlaceholder = async (userData) => {
  const { data } = await http.patch(
    `${API_ENDPOINTS.PLACEHOLDER}/${userData.id}`,
    userData
  );
  return data;
};

export const useUpdatePlaceholder = () => {
  return useMutation(updatePlaceholder);
};

export const deletePlaceholder = async (id) => {
  const { data } = await http.delete(`${API_ENDPOINTS.PLACEHOLDER}/${id}`);
  return data;
};

export const useDeletePlaceholder = () => {
  return useMutation(deletePlaceholder);
};

export const getPlaceholdersByContractId = async (id) => {
  const { data } = await http.get(`${API_ENDPOINTS.PLACEHOLDER}/contract/${id}`)
  return data;
}

export const useGetPlaceholdersByContractId = (id) => {
  return useQuery('placeholders-by-contract-id', () => getPlaceholdersByContractId(id))
}

export const useGetUsers = () => {
  return useQuery("users", getUsers);
};
export const getUsers = async () => {
  const { data } = await http.get(API_ENDPOINTS.USERS);
  return data;
};

export const useUpdatePaymentGateway = () => {
  return useMutation(updatePaymentGateway);
};

export const updatePaymentGateway = async (userData) => {
  const { data } = await http.patch(API_ENDPOINTS.PAYMENT_GATEWAY, userData);
  return data;
};

export const getPaymentGateway = async () => {
  const { data } = await http.get(API_ENDPOINTS.PAYMENT_GATEWAY);
  return data;
};

export const useGetPaymentGateway = () => {
  return useQuery("payment-gateway", getPaymentGateway);
};

export const getPaymentGatewayClient = async () => {
  const { data } = await http.get(API_ENDPOINTS.PAYMENT_GATEWAY_CLIENT);
  return data;
};

export const useGetPaymentGatewayClient = () => {
  return useQuery("payment-gateway-client", getPaymentGatewayClient);
};
