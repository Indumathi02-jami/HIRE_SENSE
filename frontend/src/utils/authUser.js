const AUTH_USER_KEY = "hiresense_ai_user";

export const getStoredAuthUser = () => {
  const rawValue = window.localStorage.getItem(AUTH_USER_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const setStoredAuthUser = (user) => {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearStoredAuthUser = () => {
  window.localStorage.removeItem(AUTH_USER_KEY);
};
