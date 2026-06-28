import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AuthToast from "../auth/AuthToast";
import useToast from "../../hooks/useToast";
import { analyzeResume } from "../../services/analysisApi";
import AnalysisBadgeGroup from "./AnalysisBadgeGroup";
import AnalysisSectionCard from "./AnalysisSectionCard";

const ResumeAnalyzer = () => {
  const fileInputRef = useRef(null);
  const { toasts, pushToast, dismissToast } = useToast();

  const [selectedFileName, setSelectedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyzeFile = async (file) => {
    if (!file) {
      return;
    }

    setSelectedFileName(file.name);
    setError("");
    setUploadProgress(0);
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const response = await analyzeResume(file, (progressEvent) => {
        const totalBytes = progressEvent.total || file.size || 1;
        const progressValue = Math.round((progressEvent.loaded * 100) / totalBytes);
        setUploadProgress(progressValue);
      });

      setUploadProgress(100);
      setAnalysisResult(response.data);
      pushToast("AI resume analysis completed.", "success");
    } catch (requestError) {
      const status = requestError.status;
      let errorMessage = requestError.message || "Resume analysis failed.";

      if (status === 429) {
        errorMessage = "API quota exceeded. Please try again in a few minutes.";
      } else if (status === 401 || status === 403) {
        errorMessage = "Authentication failed. Please sign in again.";
      } else if (status === 400) {
        errorMessage = requestError.responseData?.message || "Invalid file format or request.";
      }

      setError(errorMessage);
      pushToast(errorMessage, "error");
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelection = async (event) => {
    await handleAnalyzeFile(event.target.files?.[0]);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    await handleAnalyzeFile(event.dataTransfer.files?.[0]);
  };

  return (
    <>
      <AuthToast toasts={toasts} onDismiss={dismissToast} />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-cyan-400/10" />

        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                Resume Analysis
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">Analyze a single resume with AI</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Upload one PDF to get clear recruiter-style insights powered by Groq.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 sm:block">
              PDF only
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsDragging(false);
              }
            }}
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
                Drop one resume to analyze
              </div>
              <h3 className="text-xl font-semibold text-white">or click to browse PDF files</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                HireSense AI analyzes only this current upload and does not keep a permanent resume history here.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">
                      Analyzing Resume
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Scanning resume with AI...</h3>
                    <p className="mt-2 text-sm text-slate-200">
                      {selectedFileName || "Preparing document"} • extracting text and generating concise recruiter-style insights.
                    </p>
                  </div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-300/20 bg-slate-950/40"
                  >
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.04, 0.96] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-bold text-slate-950"
                    >
                      AI
                    </motion.div>
                  </motion.div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                    <span>Upload progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-900/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500"
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {analysisResult ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">
                      Current Resume
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {analysisResult.originalName}
                    </h3>
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
                    {analysisResult.experienceLevel}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {analysisResult.rawTextPreview}
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <AnalysisBadgeGroup title="Skills" items={analysisResult.skills} tone="cyan" />
                  <AnalysisBadgeGroup
                    title="Technologies"
                    items={analysisResult.technologies}
                    tone="emerald"
                  />
                </div>

                <AnalysisSectionCard
                  title="Recommended Roles"
                  items={analysisResult.recommendedRoles}
                  emptyText="No role recommendations available."
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <AnalysisSectionCard
                  title="Strengths"
                  items={analysisResult.strengths}
                  emptyText="No strengths were generated."
                />
                <AnalysisSectionCard
                  title="Growth Areas"
                  items={analysisResult.weakAreas}
                  emptyText="No growth areas were generated."
                />
                <AnalysisSectionCard
                  title="Domains"
                  items={analysisResult.projectDomains}
                  emptyText="No clear domains detected."
                />
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ResumeAnalyzer;
