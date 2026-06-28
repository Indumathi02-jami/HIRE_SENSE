const InterviewSession = require("../models/InterviewSession");

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(value);

const roundOne = (value) => Number(value.toFixed(1));

const extractTopSkills = (sessions, sortDirection = "desc") => {
  const skillMap = new Map();

  sessions.forEach((session) => {
    (session.qaHistory || []).forEach((entry) => {
      const skillName = entry.topicFocus || session.configuration?.domain;

      if (!skillName || typeof entry.score !== "number") {
        return;
      }

      const current = skillMap.get(skillName) || {
        skill: skillName,
        totalScore: 0,
        count: 0,
        lastConfidence: 0
      };

      current.totalScore += entry.score;
      current.count += 1;
      current.lastConfidence += entry.communicationAnalysis?.confidenceScore || 0;
      skillMap.set(skillName, current);
    });
  });

  return [...skillMap.values()]
    .map((entry) => ({
      skill: entry.skill,
      averageScore: roundOne(entry.totalScore / entry.count),
      confidenceScore: roundOne(entry.lastConfidence / entry.count),
      sessions: entry.count
    }))
    .sort((left, right) =>
      sortDirection === "desc"
        ? right.averageScore - left.averageScore || right.confidenceScore - left.confidenceScore
        : left.averageScore - right.averageScore || left.confidenceScore - right.confidenceScore
    )
    .slice(0, 5);
};

const getInterviewSessions = async (userId) =>
  InterviewSession.find({ userId }).sort({ createdAt: -1 }).lean();

const getDashboardStats = async (userId) => {
  const sessions = await getInterviewSessions(userId);
  const completedSessions = sessions.filter((session) => session.status === "completed");
  const totalInterviews = sessions.length;
  const completedInterviews = completedSessions.length;
  const averageScore = completedSessions.length
    ? roundOne(
        completedSessions.reduce((sum, session) => sum + (session.overallScore || 0), 0) /
          completedSessions.length
      )
    : 0;
  const successRate = totalInterviews
    ? roundOne((completedInterviews / totalInterviews) * 100)
    : 0;
  const averageCommunicationScore = completedSessions.length
    ? roundOne(
        completedSessions.reduce(
          (sum, session) => sum + (session.communicationReport?.communicationScore || 0),
          0
        ) / completedSessions.length
      )
    : 0;

  return {
    totalInterviews,
    completedInterviews,
    averageScore,
    successRate,
    averageCommunicationScore,
    strongestSkills: extractTopSkills(completedSessions, "desc"),
    weakestSkills: extractTopSkills(completedSessions, "asc")
  };
};

const getDashboardInterviews = async (userId) => {
  const sessions = await getInterviewSessions(userId);

  return sessions.map((session) => ({
    reportId: session.status === "completed" ? session.sessionId : null,
    sessionId: session.sessionId,
    date: session.createdAt,
    dateLabel: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(session.createdAt),
    domain: session.configuration?.domain || session.resumeProfile?.primaryDomain || "Interview",
    score: session.overallScore || 0,
    communicationScore: session.communicationReport?.communicationScore || 0,
    status: session.status
  }));
};

const getDashboardTrends = async (userId) => {
  const sessions = await getInterviewSessions(userId);
  const completedSessions = [...sessions]
    .filter((session) => session.status === "completed")
    .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));

  const scoreTrend = completedSessions.map((session) => ({
    label: formatDateLabel(session.createdAt),
    value: session.overallScore || 0,
    domain: session.configuration?.domain || session.resumeProfile?.primaryDomain || "Interview"
  }));

  const communicationTrend = completedSessions.map((session) => ({
    label: formatDateLabel(session.createdAt),
    value: session.communicationReport?.communicationScore || 0,
    confidence: session.communicationReport?.confidenceScore || 0
  }));

  const completionStats = {
    completed: sessions.filter((session) => session.status === "completed").length,
    inProgress: sessions.filter((session) => session.status === "in-progress").length
  };

  return {
    scoreTrend,
    communicationTrend,
    completionStats
  };
};

module.exports = {
  getDashboardStats,
  getDashboardInterviews,
  getDashboardTrends
};
