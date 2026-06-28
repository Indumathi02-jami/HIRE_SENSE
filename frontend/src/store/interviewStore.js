import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialConfiguration = {
  difficulty: "Intermediate",
  interviewType: "Technical"
};

const initialState = {
  phase: "configuration",
  configuration: initialConfiguration,
  resumeAnalysis: null,
  session: null,
  currentAnswer: "",
  autoSubmitOnTimeout: true
};

export const useInterviewStore = create(
  persist(
    (set) => ({
      ...initialState,
      setConfiguration: (configuration) =>
        set((state) => ({
          configuration: {
            ...state.configuration,
            ...configuration
          }
        })),
      setResumeAnalysis: (resumeAnalysis) => set({ resumeAnalysis }),
      setCurrentAnswer: (currentAnswer) => set({ currentAnswer }),
      setAutoSubmitOnTimeout: (autoSubmitOnTimeout) => set({ autoSubmitOnTimeout }),
      startSession: ({ configuration, resumeAnalysis, session }) =>
        set({
          phase: "interview",
          configuration,
          resumeAnalysis,
          session,
          currentAnswer: ""
        }),
      applyAnswerResult: ({ session, isInterviewComplete }) =>
        set({
          session,
          phase: isInterviewComplete ? "review" : "interview",
          currentAnswer: ""
        }),
      completeSession: (session) =>
        set({
          session,
          phase: "report",
          currentAnswer: ""
        }),
      resetInterview: () =>
        set({
          ...initialState
        })
    }),
    {
      name: "hiresense-interview-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        phase: state.phase,
        configuration: state.configuration,
        resumeAnalysis: state.resumeAnalysis,
        session: state.session,
        currentAnswer: state.currentAnswer,
        autoSubmitOnTimeout: state.autoSubmitOnTimeout
      })
    }
  )
);
