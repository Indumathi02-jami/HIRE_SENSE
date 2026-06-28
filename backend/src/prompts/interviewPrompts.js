const buildSystemPrompt = () => `
You are HireSense AI, a senior technical interviewer and professional recruiter.
Stay fully in character as an interviewer.
Ask only one question at a time.
Never reveal internal scoring logic.
Never provide the direct answer to the candidate.
Keep language concise, professional, and realistic.
Always return valid JSON only.
`.trim();

const buildResumeAnalysisPrompt = (resumeText) => `
Analyze this candidate resume and infer the strongest interview focus.

Return only a JSON object with this shape:
{
  "primaryDomain": "String describing the most relevant interview track, e.g. MERN Stack, Java Backend, SQL/DBMS, HR, DSA",
  "experienceLevel": "String such as Beginner, Intermediate, Advanced, Junior, Mid-Level, Senior",
  "interviewFocus": "Short sentence describing the most relevant interview focus",
  "skills": ["soft/general skills"],
  "technologies": ["languages, databases, platforms"],
  "domains": ["industry or problem domains"],
  "frameworks": ["frameworks and libraries"],
  "tools": ["developer tools, cloud tools, CI/CD, analytics tools"]
}

Rules:
- Infer the candidate's strongest stack from the resume.
- Prefer practical interview focus labels like MERN Stack, Frontend React, Java Spring Backend, Data Analyst SQL, HR Generalist.
- Keep arrays concise and relevant.
- Do not include markdown or explanation.

Resume text:
${resumeText}
`.trim();

const buildStartInterviewPrompt = ({ domain, difficulty, interviewType, resumeProfile }) => `
Create the opening question for a mock interview.

Interview configuration:
- Domain: ${domain}
- Difficulty: ${difficulty}
- Interview type: ${interviewType}
- Candidate experience level: ${resumeProfile.experienceLevel}
- Candidate interview focus: ${resumeProfile.interviewFocus}
- Candidate technologies: ${resumeProfile.technologies.join(", ")}
- Candidate frameworks: ${resumeProfile.frameworks.join(", ")}
- Candidate tools: ${resumeProfile.tools.join(", ")}
- Candidate skills: ${resumeProfile.skills.join(", ")}
- Candidate domains: ${resumeProfile.domains.join(", ")}

Rules:
- Ask exactly one interview question.
- Make it realistic and professional.
- Match the candidate's strongest resume stack and the configured difficulty/interview type.
- Do not include any explanation outside JSON.
`.trim();

const buildAnswerEvaluationPrompt = ({
  domain,
  interviewType,
  currentDifficulty,
  currentQuestion,
  answer,
  answeredHistory,
  questionHistory,
  resumeProfile,
  questionNumber,
  totalQuestions
}) => `
Evaluate the candidate answer and decide the next interview step.

Interview configuration:
- Domain: ${domain}
- Interview type: ${interviewType}
- Current difficulty: ${currentDifficulty}
- Question number: ${questionNumber} of ${totalQuestions}
- Candidate experience level: ${resumeProfile.experienceLevel}
- Candidate interview focus: ${resumeProfile.interviewFocus}
- Candidate technologies: ${resumeProfile.technologies.join(", ")}
- Candidate frameworks: ${resumeProfile.frameworks.join(", ")}
- Candidate tools: ${resumeProfile.tools.join(", ")}
- Candidate skills: ${resumeProfile.skills.join(", ")}

Current question:
${currentQuestion}

Candidate answer:
${answer}

Previous answered interview history:
${JSON.stringify(answeredHistory, null, 2)}

Question topic history:
${JSON.stringify(questionHistory, null, 2)}

Rules:
- Score from 0 to 10.
- Assess technical correctness, communication clarity, and confidence.
- Feedback should be concise, realistic, and recruiter-style.
- Detect whether the candidate sounded high confidence, medium confidence, or low confidence.
- Track whether the current answer stayed at surface depth, working depth, or deep technical depth.
- Use realistic interviewer behavior: challenge assumptions, ask "why", test tradeoffs, or step down to fundamentals when needed.
- If the answer is strong, raise or maintain difficulty thoughtfully and probe deeper on the same topic when appropriate.
- If the answer is weak, lower or maintain difficulty to test fundamentals and recover understanding.
- Avoid repeating earlier questions or asking the same concept in nearly identical wording.
- Ask exactly one next question based on the candidate's actual resume stack and the immediately previous answer context.
- Return topicFocus as the main concept being probed next.
- Return followUpIntent as one of: deepen, pivot, recover, escalate, validate.
- Never provide the direct answer to the previous question.
- Return JSON only.
`.trim();

const buildFinalReportPrompt = ({ configuration, resumeProfile, answeredHistory, overallScore }) => `
Generate a final mock interview report for the candidate.

Interview configuration:
${JSON.stringify(configuration, null, 2)}

Detected resume profile:
${JSON.stringify(resumeProfile, null, 2)}

Answered interview history:
${JSON.stringify(answeredHistory, null, 2)}

Calculated overall score:
${overallScore}

Rules:
- Summarize performance like a senior interviewer.
- Keep the interview summary concise but useful.
- Return all of these fields every time:
  {
    "finalReport": "Short summary paragraph",
    "overallScore": 0,
    "questionReviews": [
      {
        "question": "Original interview question",
        "userAnswer": "Candidate answer",
        "isCorrect": true,
        "whatWasGood": "What the candidate explained well",
        "missingConcepts": ["List of missing concepts if any"],
        "idealAnswer": "A complete structured interview-quality answer"
      }
    ]
  }
- questionReviews must include one entry for every answered interview question.
- isCorrect must clearly mark whether the answer was correct overall.
- whatWasGood must explain what the candidate did well in one or two concise sentences.
- missingConcepts must list the important concepts, tradeoffs, or details that were omitted. Use an empty array only if nothing important was missing.
- idealAnswer must be a polished interview-quality answer that teaches the user the correct structured response.
- Return JSON only.
`.trim();

module.exports = {
  buildSystemPrompt,
  buildResumeAnalysisPrompt,
  buildStartInterviewPrompt,
  buildAnswerEvaluationPrompt,
  buildFinalReportPrompt
};
