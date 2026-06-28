import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  const response = await apiClient.get("/dashboard/stats");
  return response.data;
};

export const getDashboardInterviews = async () => {
  const response = await apiClient.get("/dashboard/interviews");
  return response.data;
};

export const getDashboardTrends = async () => {
  const response = await apiClient.get("/dashboard/trends");
  return response.data;
};
