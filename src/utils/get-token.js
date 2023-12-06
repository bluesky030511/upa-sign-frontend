import { TOKEN } from "./variables";

export const getToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return localStorage.getItem(TOKEN);
};
