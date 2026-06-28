import { motion, useReducedMotion } from "framer-motion";

const toneMap = {
  cyan: {
    shell: "border-cyan-400/16 bg-cyan-500/[0.08]",
    badge: "border-cyan-300/18 bg-cyan-400/12 text-cyan-100",
    icon: "text-cyan-200"
  },
  rose: {
    shell: "border-rose-400/16 bg-rose-500/[0.08]",
    badge: "border-rose-300/18 bg-rose-400/12 text-rose-100",
    icon: "text-rose-200"
  },
  amber: {
    shell: "border-amber-400/16 bg-amber-500/[0.08]",
    badge: "border-amber-300/18 bg-amber-400/12 text-amber-100",
    icon: "text-amber-100"
  }
};

const AnalysisSectionCard = ({ title, items, emptyText, icon, tone = "cyan", subtitle }) => {
  const palette = toneMap[tone] || toneMap.cyan;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.16 : 0.28 }}
      className={`flex h-full min-h-[280px] flex-col rounded-[28px] border p-5 shadow-[0_18px_50px_rgba(2,6,23,0.24)] backdrop-blur-2xl sm:p-6 ${palette.shell}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-100">{title}</h3>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p> : null}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${palette.badge} ${palette.icon}`}
        >
          {icon}
        </div>
      </div>

      {items?.length ? (
        <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm leading-6 text-slate-100">
          {items.map((item) => (
            <li
              key={`${title}-${item}`}
              className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3.5 text-sm leading-6 text-slate-100"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 flex flex-1 items-center rounded-2xl border border-dashed border-white/10 bg-slate-950/25 px-4 py-5">
          <p className="text-sm leading-6 text-slate-400">{emptyText}</p>
        </div>
      )}
    </motion.section>
  );
};

export default AnalysisSectionCard;
