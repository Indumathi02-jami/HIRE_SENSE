import { motion } from "framer-motion";
import Logo from "../layout/Logo";

const AuthShell = ({ eyebrow, title, description, children, footer }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute left-4 top-4">
          <Logo compact />
        </div>
        <div className="grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <span className="inline-flex rounded-full border border-cyan-300/15 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
              {eyebrow}
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-tight text-white">
              Premium AI hiring workflows start with a calm, trustworthy first step.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              HireSense AI keeps authentication minimal, clear, and polished so teams can
              onboard with confidence from the first interaction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full px-4 py-2 text-cyan-200 clay-badge">
                Real-time validation
              </span>
              <span className="rounded-full px-4 py-2 text-cyan-200 clay-badge">
                Elegant motion
              </span>
              <span className="rounded-full px-4 py-2 text-cyan-200 clay-badge">
                Mobile-first clay UI
              </span>
            </div>
          </motion.div>
 
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            className="clay-card relative w-full overflow-hidden rounded-[32px] p-5 shadow-[0_30px_80px_rgba(2,6,23,0.6)] sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_24%)]" />
            <div className="relative">
              <span className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-200 clay-badge">
                {eyebrow}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>

              <div className="mt-8">{children}</div>

              {footer ? <div className="mt-6 text-sm text-slate-300">{footer}</div> : null}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
