export const formatFileSizeMB = (bytes) => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatUploadDate = (dateValue) => {
  return new Date(dateValue).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};
