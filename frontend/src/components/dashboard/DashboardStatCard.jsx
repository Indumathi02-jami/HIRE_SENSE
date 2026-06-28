import { motion } from "framer-motion";

const DashboardStatCard = ({ label, value, accent, detail }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.18 }}
    className="glass-card glass-card-hover rounded-[28px] p-6 shadow-[0_20px_48px_rgba(2,6,23,0.22)]"
  >
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
    <div className="mt-4 flex items-end justify-between gap-3">
      <p className="text-4xl font-extrabold text-white tracking-tight">{value}</p>
      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${accent}`}>{detail}</span>
    </div>
  </motion.div>
);

export default DashboardStatCard;
