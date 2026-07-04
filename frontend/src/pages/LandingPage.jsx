import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../components/layout/Logo";


const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Mock Interview", href: "#preview" },
  { label: "Resume Analysis", href: "#features" },
  { label: "Pricing", href: "#pricing" }
];

const featureCards = [
  {
    eyebrow: "Resume Intelligence",
    title: "AI Resume Analysis",
    description:
      "Detect stack, experience signals, tools, and strengths from the candidate's resume before a single question is asked."
  },
  {
    eyebrow: "Adaptive Practice",
    title: "AI Mock Interviews",
    description:
      "Run realistic interview rounds that adapt difficulty, ask follow-up questions, and react to answer quality in real time."
  },
  {
    eyebrow: "Actionable Learning",
    title: "Detailed Interview Reports",
    description:
      "Review each answer with precise feedback, missing concepts, and ideal structured responses that sharpen future performance."
  },
  {
    eyebrow: "Progress Visibility",
    title: "Analytics Dashboard",
    description:
      "Track communication performance, interview consistency, and skill growth with a focused analytics experience."
  }
];

const workflowSteps = [
  {
    step: "Step 1",
    title: "Upload Resume",
    description: "Start with a single PDF and let HireSense AI understand the candidate's background automatically."
  },
  {
    step: "Step 2",
    title: "AI Analyzes Skills",
    description: "The system extracts technologies, project exposure, experience level, and the likely interview focus."
  },
  {
    step: "Step 3",
    title: "Take Mock Interview",
    description: "Attend a personalized interview with adaptive questioning, confidence-aware follow-ups, and clean timing."
  },
  {
    step: "Step 4",
    title: "Receive Detailed Report",
    description: "Finish with a question-by-question review, ideal answers, and measurable interview improvement guidance."
  }
];

const valueProps = [
  "Personalized interviews tuned to the candidate's actual stack",
  "Resume-aware questions instead of generic practice prompts",
  "AI feedback that explains what was right, weak, or incomplete",
  "Performance tracking that highlights growth over time",
  "A calmer way to build interview confidence before the real round"
];

const previewCards = [
  {
    title: "Resume Analysis",
    accent: "Resume-aware insights",
    lines: ["React, Node.js, MongoDB", "Experience: Mid-Level", "Suggested focus: MERN interviews"]
  },
  {
    title: "Interview Screen",
    accent: "Focused interview flow",
    lines: ["One active question", "Countdown timer", "Voice + text answer capture"]
  },
  {
    title: "Final Report",
    accent: "Detailed answer review",
    lines: ["AI evaluation", "Missing concepts", "Ideal structured answer"]
  },
  {
    title: "Analytics Dashboard",
    accent: "Performance tracking",
    lines: ["Communication score", "Strongest skills", "Interview history"]
  }
];

// Testimonials removed per request

const pricingCards = [
  {
    name: "Starter",
    price: "Free",
    description: "Great for trying the interview flow and understanding how HireSense AI works.",
    items: ["Resume analysis", "Mock interview access", "Core interview reports"]
  },
  {
    name: "Growth",
    price: "Pro",
    description: "For candidates who want repeated practice, richer analytics, and structured performance improvement.",
    items: ["Advanced interview history", "Analytics dashboard", "Communication scoring"]
  }
];

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

const cardReveal = {
  hidden: { opacity: 0, y: 22 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.08, ease: "easeOut" }
  })
};

const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
  <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
    <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <main className="mesh-background relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute right-[-4rem] top-28 h-80 w-80 rounded-full bg-blue-500/14 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-cyan-500/10 bg-slate-950/70 backdrop-blur-2xl shadow-lg shadow-cyan-950/5">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full clay-btn px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pt-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={sectionReveal}
          className="relative z-10"
        >
          <span className="inline-flex items-center rounded-full border border-cyan-400/18 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">
            AI-Powered Interview Preparation
          </span>

          <div className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ frontSize: "500px", lineHeight: "1.1" }}>
            HireSense
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Master Every Interview with AI
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Upload your resume, practice AI-powered mock interviews, receive detailed feedback, and track your growth with HireSense AI.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-2xl clay-btn px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Start Free Interview
            </Link>
            <a
              href="#preview"
              className="rounded-2xl clay-btn-secondary px-6 py-4 text-sm font-semibold text-slate-100 transition"
            >
              Watch Demo
            </a>
          </div>
 
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { label: "Resume-aware", value: "AI interviews" },
              { label: "Question-by-question", value: "answer reviews" },
              { label: "Performance", value: "analytics tracking" }
            ].map((item) => (
              <div key={item.label} className="clay-card clay-card-hover rounded-2xl px-4 py-4">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="relative"
        >
          <div className="clay-card relative overflow-hidden rounded-[36px] p-6 shadow-[0_40px_110px_rgba(2,6,23,0.48)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/12 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Live Interview Workspace</p>
                <p className="mt-1 text-sm text-slate-400">Personalized to the candidate's resume</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                AI Active
              </span>
            </div>
 
            <div className="mt-8 grid gap-4">
              <div className="rounded-[28px] clay-input p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-300">Detected Tech Stack</p>
                  <span className="rounded-full px-3 py-1 text-xs text-cyan-200 clay-badge">Resume-aware</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["React", "Node.js", "MongoDB", "Express", "JavaScript", "REST APIs"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full px-3 py-1 text-xs font-medium text-slate-100 clay-badge"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
 
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] clay-input p-5">
                  <p className="text-sm font-medium text-slate-300">Current Interview Prompt</p>
                  <p className="mt-4 text-lg font-medium leading-8 text-white">
                    Explain how you would structure a MERN application that needs authentication, role-based access, and scalable API routes.
                  </p>
                  <div className="mt-6 rounded-2xl p-4 text-sm leading-7 text-cyan-200 clay-badge">
                    Adaptive cross-questioning, confidence-aware difficulty, and communication scoring are all running within the same interview flow.
                  </div>
                </div>
 
                <div className="grid gap-4">
                  <div className="rounded-[28px] clay-input p-5">
                    <p className="text-sm font-medium text-slate-300">Report Snapshot</p>
                    <p className="mt-4 text-4xl font-semibold text-white">86</p>
                    <p className="mt-2 text-sm text-slate-400">Overall interview score</p>
                  </div>
                  <div className="rounded-[28px] clay-input p-5">
                    <p className="text-sm font-medium text-slate-300">Communication</p>
                    <div className="mt-4 h-2 rounded-full bg-white/8">
                      <div className="h-2 w-[74%] rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Strong clarity, calmer pacing, fewer filler words.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        id="features"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto mt-8 w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Features"
          title="Everything needed for interview practice that actually reflects the candidate"
          description="HireSense AI combines resume understanding, adaptive interviewing, detailed answer review, and focused analytics into one premium preparation flow."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              className="clay-card clay-card-hover rounded-[28px] p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{card.eyebrow}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="how-it-works"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="How It Works"
          title="A clear interview workflow from resume upload to final review"
          description="The product is designed to feel intelligent from the first step, without forcing the user to manually configure every skill or topic."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.title}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              className="clay-card clay-card-hover relative rounded-[28px] p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{step.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{step.description}</p>
              {index < workflowSteps.length - 1 ? (
                <div className="mt-8 hidden h-px bg-gradient-to-r from-cyan-300/40 to-transparent lg:block" />
              ) : null}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="clay-card rounded-[32px] p-7 sm:p-8">
            <SectionHeading
              eyebrow="Why HireSense AI"
              title="Built to make interview preparation smarter, calmer, and more personalized"
              description="Instead of giving generic practice prompts, HireSense AI tailors the experience to the candidate's actual background and helps them improve where it matters."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {valueProps.map((item, index) => (
              <motion.div
                key={item}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardReveal}
                className="clay-card clay-card-hover rounded-[28px] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-100">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="preview"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Preview"
          title="A focused product experience from analysis to reporting"
          description="Each screen is built to feel clear, premium, and useful at a glance for first-time users and repeat practice alike."
          align="center"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {previewCards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardReveal}
              className="clay-card clay-card-hover group rounded-[30px] p-5"
            >
              <div className="rounded-[24px] clay-input p-4">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200 clay-badge">
                    {card.accent}
                  </span>
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-300/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-300/80" />
                  </div>
                </div>
                <div className="rounded-[22px] clay-card p-4">
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <div className="mt-4 grid gap-3">
                    {card.lines.map((line) => (
                      <div
                        key={line}
                        className="rounded-2xl clay-input px-3 py-3 text-sm text-slate-300"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials section removed per request */}

      <motion.section
        id="pricing"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="clay-card rounded-[32px] p-7 sm:p-8">
            <SectionHeading
              eyebrow="Pricing"
              title="Start simple, then grow into a deeper interview practice system"
              description="Keep the decision clear and low-friction for first-time visitors while still signaling that the platform supports more advanced practice."
            />
          </div>
 
          <div className="grid gap-5 md:grid-cols-2">
            {pricingCards.map((plan, index) => (
              <motion.div
                key={plan.name}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardReveal}
                className={`clay-card rounded-[28px] p-6 relative transition-all duration-300 ${plan.price === 'Pro' ? 'scale-[1.02]' : ''}`}
              >
                {plan.price === 'Pro' && (
                  <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                    Recommended
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
                <div className="mt-6 grid gap-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3 text-sm text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8"
      >
        <div className="clay-card overflow-hidden rounded-[36px] p-8 sm:p-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Final CTA</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ready to Crack Your Next Interview?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Start with your resume, practice with AI, and walk into the next interview with sharper answers and more confidence.
              </p>
            </div>
 
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl clay-btn px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Start Interview
              </Link>
              <Link
                to="/login"
                className="rounded-2xl clay-btn-secondary px-6 py-4 text-sm font-semibold text-slate-100 transition"
              >
                Upload Resume
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white">HireSense AI</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Premium AI interview preparation with resume-aware analysis, adaptive mock interviews, and detailed performance review.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="mailto:contact@hiresense.ai" className="transition hover:text-white">Contact</a>
            <a href="#privacy" className="transition hover:text-white">Privacy Policy</a>
            <a href="#terms" className="transition hover:text-white">Terms</a>
          </div>

          <div className="flex items-center gap-3">
            {["X", "in", "gh"].map((item) => (
              <span
                key={item}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-semibold text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
