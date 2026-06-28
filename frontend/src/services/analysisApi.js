import apiClient from "./apiClient";

export const analyzeResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiClient.post("/analysis/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return response.data;
};
