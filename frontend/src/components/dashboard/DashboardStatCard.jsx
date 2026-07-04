import { motion } from "framer-motion";

const getClayBadgeClass = (accent = "") => {
  if (accent.includes("cyan")) return "clay-badge text-cyan-200";
  if (accent.includes("emerald")) return "clay-badge-emerald text-emerald-200";
  if (accent.includes("rose")) return "clay-badge-rose text-rose-200";
  if (accent.includes("indigo") || accent.includes("violet")) return "clay-badge-indigo text-indigo-200";
  return "clay-badge text-cyan-200";
};

const DashboardStatCard = ({ label, value, accent, detail }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.18 }}
    className="clay-card clay-card-hover rounded-[28px] p-6 shadow-[0_20px_48px_rgba(2,6,23,0.22)]"
  >
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
    <div className="mt-4 flex items-end justify-between gap-3">
      <p className="text-4xl font-extrabold text-white tracking-tight">{value}</p>
      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getClayBadgeClass(accent)}`}>{detail}</span>
    </div>
  </motion.div>
);

export default DashboardStatCard;
