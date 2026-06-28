import apiClient from "./apiClient";

export const analyzeInterviewResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiClient.post("/interview/analyze-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return response.data;
};

export const startInterview = async (payload) => {
  const response = await apiClient.post("/interview/start", payload);
  return response.data;
};

export const submitInterviewAnswer = async (payload) => {
  const response = await apiClient.post("/interview/answer", payload);
  return response.data;
};

export const endInterview = async (payload) => {
  const response = await apiClient.post("/interview/end", payload);
  return response.data;
};

export const getInterviewReport = async (reportId) => {
  const response = await apiClient.get(`/interview/reports/${reportId}`);
  return response.data;
};
