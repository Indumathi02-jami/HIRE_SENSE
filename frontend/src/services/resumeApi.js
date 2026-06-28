import apiClient from "./apiClient";

export const uploadResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiClient.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress
  });

  return response.data;
};

export const getResumeHistory = async () => {
  const response = await apiClient.get("/resumes/history");
  return response.data;
};
