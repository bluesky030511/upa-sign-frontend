export const TOKEN = "accessToken";
export const PLAN = "plan";
export const SHOWN = "shown";
// export const BASE_URL = "https://api.upasign.com";
export const BASE_URL = 'http://localhost:5000'
export const LIVE_URL = "https://upasign.com";

export const API_ENDPOINTS = {
  //Auth End points
  REGISTER: "/account/register",
  LOGIN: "/account/login",
  CONTRACT: "/contract",
  FILE: "/file",
  PROFILE: "/account/profile",
  CHANGE_PASSWORD: "/account/change-password",
  FORGOT_PASSWORD: "/account/forgot-password",
  RESET_PASSWORD: "/account/forgot-password/hash",
  CONTACT_US: "/contactus",
  TEMPLATE: "/template",
  DOCUMENT: "/document",
  SUBSCRIPTION: "/subscription",
  NEWSLETTER: "/newsletter",
  PLACEHOLDER: '/placeholder',
  USERS: '/account/users',
  PAYMENT_GATEWAY: '/account/payment-gateway',
  PAYMENT_GATEWAY_CLIENT: '/account/payment-gateway-client',
};

export const PLAN_KEYS = {
  free: "1mOMI4SWH7",
  personal: "ar1zIVpEDH",
  standard: "8RKs8BD3TQ",
  business: "fXl9GqPb0M",
};

export const PLAN_PRICING = {
  "1mOMI4SWH7": "0.00",
  ar1zIVpEDH: "15.00",
  "8RKs8BD3TQ": "45.00",
  fXl9GqPb0M: "65.00",
};

export const PLANCODE = {
  "1mOMI4SWH7": "FREE",
  ar1zIVpEDH: "BASIC",
  "8RKs8BD3TQ": "STANDARD",
  fXl9GqPb0M: "BUSINESS_PRO",
};
