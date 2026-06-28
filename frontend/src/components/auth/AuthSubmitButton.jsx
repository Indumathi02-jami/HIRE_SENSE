import { motion } from "framer-motion";

const AuthSubmitButton = ({ children, isLoading, loadingText = "Please wait...", ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(34,211,238,0.25)] hover:shadow-glow-cyan transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthSubmitButton;
