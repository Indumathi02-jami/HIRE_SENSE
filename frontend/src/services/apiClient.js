import axios from "axios";

import { clearAuthToken, getAuthToken } from "../utils/authToken";
import { clearStoredAuthUser } from "../utils/authUser";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    // The token is attached automatically on every request so protected APIs
    // receive backend-verifiable identity without passing user ids manually.
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const apiMessage =
      responseData?.message ||
      responseData?.error ||
      error.message ||
      "An unexpected error occurred.";

    if (status === 401) {
      clearAuthToken();
      clearStoredAuthUser();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    const enrichedError = new Error(apiMessage);
    enrichedError.status = status;
    enrichedError.response = error.response;
    enrichedError.responseData = responseData;

    return Promise.reject(enrichedError);
  }
);

export default apiClient;
