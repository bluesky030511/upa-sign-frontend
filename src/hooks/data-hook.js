import { useMutation, useQuery } from "react-query";
import { API_ENDPOINTS, BASE_URL } from "../utils/variables";
import http from "../utils/http";
import axios from "axios";

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

const getSignedContractById = async (id) => {
  const { data } = await http.get(`${API_ENDPOINTS.CONTRACT}/${id}/get-sign-invite`);
  return data;
}

const getAllContract = async () => {
  const { data } = await http.post(`${BASE_URL}${API_ENDPOINTS.CONTRACT}/get-all-invite`);
  return data;
}

const getAllIssue = async () => {
  const { data } = await http.get(`${BASE_URL}${API_ENDPOINTS.USERS}/get-all-issues`);
  return data;
}

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
    const { data } = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.CONTRACT}/invite/${input.contractId}`, //${input.inviteId}/status`,
      {...input.data, inviteId: input.inviteId},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${input.accessToken}`,
        },
      }
    );
    return data; 
  // const { data } = await http.post(
  //   `${API_ENDPOINTS.CONTRACT}/${input.contractId}/invite/${input.inviteId}/status`,
  //   input.data
  // );
  // return data;
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

export const useGetSignedContractById = (id) => {
  return useQuery("get-signed-contract-by-id", () => getSignedContractById(id));
}

export const useGetAllContract = () => {
  return useQuery("get-all-invite", () => getAllContract());
}

export const useGetAllIssue = () => {
  return useQuery("get-all-issues", () => getAllIssue());
}

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

export const createTemplate = async (userData) => {
  const { data } = await http.post(`${API_ENDPOINTS.TEMPLATE}/doc/${userData.id}`, userData.tempData);
  return data;
}

export const useCreateTemplate = () => {
  return useMutation(createTemplate);
}

export const useSubmitIssue = () => {
  return useMutation(submitIssue);
}

const submitIssue = async (userData) => {
  const {data} = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/create-issue`, userData);
  return data;
}

const updateIssueStatus = async (userData) => {
  const {data} = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/update-status/${userData.id}`, userData.value);
  return data;
}

export const useUpdateIssueStatus = () => {
  return useMutation(updateIssueStatus);
}

const sendMail = async (userData) => {
  const {data} = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/send-mail`, userData);
}

export const useSendMail = () => {
  return useMutation(sendMail);
}

export const useVerifyUser = () => {
  return useMutation(verifyUser);
}

const verifyUser = async (userData) => {
  const { data } = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/verify-user`, userData);
  return data;
};


export const addAccessPermission = async (userData) => {
  const { data } = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/add-access`, userData);
  return data;
}

export const useAddAccessPermission = () => {
  return useMutation(addAccessPermission);
}

export const assignSignature = async (userData) => {
  const { data } = await http.post(`${BASE_URL}${API_ENDPOINTS.CONTRACT}/${userData.contractId}/assign-invite`, userData.data);
  return data;
}

export const useAssignSignature = () => {
  return useMutation(assignSignature);
}

export const deleteAccessPermission = async (userData) => {
  const { data } = await http.post(`${BASE_URL}${API_ENDPOINTS.USERS}/delete-access`, userData);
  return data;
}

export const useDeleteAccessPermission = () => {
  return useMutation(deleteAccessPermission);
}

export const getAccessUserList = async () => {
  const { data } = await http.get(`${BASE_URL}${API_ENDPOINTS.USERS}/get-access`);
  return data;
}

export const useGetAccessUserList = () => {
  return useQuery("accessUserList", getAccessUserList);
}

export const getTemplateFields = async (id) => {
  const { data } = await http.get(`${BASE_URL}${API_ENDPOINTS.TEMPLATE}/edit/${id}`);
  return data;
}

export const useGetTemplateFields = (id) => {
  return useQuery("getTemplateFields", () => getTemplateFields(id));
}

export const deletePlaceholder = async (id) => {
  const { data } = await http.delete(`${API_ENDPOINTS.PLACEHOLDER}/${id}`);
  return data;
};

export const useDeletePlaceholder = () => {
  return useMutation(deletePlaceholder);
};

export const getPlaceholdersByContractId = async (id, accessToken) => {
  if(accessToken) {
    const { data } = await axios.get(`${BASE_URL}${API_ENDPOINTS.PLACEHOLDER}/contract/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return data;
  }

  const { data } = await http.get(`${API_ENDPOINTS.PLACEHOLDER}/contract/${id}`);
  return data;
}

export const useGetPlaceholdersByContractId = (id, accessToken) => {
  return useQuery('placeholders-by-contract-id', () => getPlaceholdersByContractId(id, accessToken))
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

export const getSubscriptions = async (id) => {
  const { data } = await http.get(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`)
  return data;
}

export const useGetSubscriptions = (id) => {
  return useQuery('user-subscriptions', () => getSubscriptions(id))
}

export const deleteSubscription = async (id) => {
  const { data } = await http.delete(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`)
  return data;
}

export const useDeleteSubscription = () => {
  return useMutation(deleteSubscription)
}