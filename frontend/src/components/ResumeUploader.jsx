import { useEffect, useRef, useState } from "react";

import ResumeHistory from "./ResumeHistory";
import UploadProgress from "./UploadProgress";
import { getResumeHistory, uploadResume } from "../services/resumeApi";

const ResumeUploader = () => {
  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");
      const response = await getResumeHistory();
      setResumes(response.data ?? []);
    } catch (error) {
      setHistoryError(error.message || "Unable to load resume history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const resetUploadState = () => {
    setUploadError("");
    setUploadMessage("");
    setUploadProgress(0);
    setUploadComplete(false);
  };

  const processFile = async (file) => {
    if (!file) {
      return;
    }

    resetUploadState();
    setIsUploading(true);

    try {
      const response = await uploadResume(file, (progressEvent) => {
        // Axios exposes upload progress through onUploadProgress so the UI
        // can animate the bar with real-time bytes transferred from the browser.
        const totalBytes = progressEvent.total || file.size || 1;
        const progressValue = Math.round((progressEvent.loaded * 100) / totalBytes);
        setUploadProgress(progressValue);
      });

      setUploadProgress(100);
      setUploadComplete(true);
      setUploadMessage(response.message || "Resume uploaded successfully.");
      await fetchHistory();
    } catch (error) {
      setUploadError(error.message || "Resume upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files?.[0];
    await processFile(selectedFile);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    await processFile(droppedFile);
  };

  const handleDragOver = (event) => {
    // Preventing default keeps the browser from opening the file and lets
    // this card behave like a real drop zone for resume uploads.
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Resume Hub
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Upload candidate resumes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Secure PDF uploads with a recruiter-ready activity history.
            </p>
          </div>
          <div className="relative hidden h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 sm:flex">
            <span className="absolute inset-0 rounded-2xl border border-cyan-300/20 animate-pulseRing" />
            <span className="text-2xl">AI</span>
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`cursor-pointer rounded-[28px] border border-dashed p-6 transition duration-300 sm:p-8 ${
            isDragging
              ? "border-cyan-300 bg-cyan-400/10 shadow-glow"
              : "border-white/15 bg-slate-950/35 hover:border-cyan-300/40 hover:bg-white/10"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileSelection}
          />

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-cyan-100 backdrop-blur-xl">
              Drag and drop a PDF resume here
            </div>
            <h3 className="text-xl font-semibold text-white">or click to browse files</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Only PDF files are accepted. Maximum file size is 5MB. Every upload is validated
              again on the backend before storage.
            </p>
          </div>
        </div>

        {isUploading || uploadComplete ? (
          <div className={`${uploadComplete ? "animate-popIn" : ""}`}>
            <UploadProgress progress={uploadProgress} isComplete={uploadComplete} />
          </div>
        ) : null}

        {uploadMessage ? (
          <div className="animate-popIn rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            {uploadMessage}
          </div>
        ) : null}

        {uploadError ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {uploadError}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                Upload History
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Recent candidate resumes</h3>
            </div>
            <button
              type="button"
              onClick={fetchHistory}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
            >
              Refresh
            </button>
          </div>

          <ResumeHistory resumes={resumes} isLoading={historyLoading} error={historyError} />
        </div>
      </div>
    </div>
  );
};

export default ResumeUploader;
