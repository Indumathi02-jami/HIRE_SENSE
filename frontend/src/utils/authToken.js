const AUTH_TOKEN_KEY = "hiresense_ai_token";
const LEGACY_MOCK_TOKEN = "mock-jwt-token-for-ui-preview";

export const getAuthToken = () => {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);

  if (token === LEGACY_MOCK_TOKEN) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }

  return token;
};

export const setAuthToken = (token) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const hasAuthToken = () => Boolean(getAuthToken());
