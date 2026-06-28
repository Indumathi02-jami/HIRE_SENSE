import { motion } from "framer-motion";

const ProfilePage = ({ user }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="mx-auto w-full max-w-4xl glass-card rounded-[32px] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.26)] border border-cyan-500/10 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">Profile</p>
      <h1 className="mt-3 text-3xl font-bold text-white">Your HireSense AI workspace profile</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        Manage your identity context for analytics, mock interviews, and personalized AI guidance.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-cyan-500/10 bg-slate-950/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Full Name</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.fullName || "Not provided"}</p>
        </div>
        <div className="rounded-[28px] border border-cyan-500/10 bg-slate-950/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Email</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.email || "Unavailable"}</p>
        </div>
      </div>
    </motion.section>
  );
};

export default ProfilePage;
