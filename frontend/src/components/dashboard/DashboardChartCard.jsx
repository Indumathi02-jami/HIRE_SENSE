import { motion } from "framer-motion";

const DashboardChartCard = ({ title, subtitle, children, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.26 }}
    className={`glass-card rounded-[30px] p-6 shadow-[0_20px_54px_rgba(2,6,23,0.24)] border border-cyan-500/5 ${className}`}
  >
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p> : null}
    </div>
    {children}
  </motion.section>
);

export default DashboardChartCard;
