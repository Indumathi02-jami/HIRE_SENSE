import { AnimatePresence, motion } from "framer-motion";

const AuthToast = ({ toasts, onDismiss }) => {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className={`pointer-events-auto rounded-2xl border p-4 backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-400/20 bg-emerald-500/12 text-emerald-50"
                : "border-rose-400/20 bg-rose-500/12 text-rose-50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">
                  {toast.type === "success" ? "Success" : "Something went wrong"}
                </p>
                <p className="mt-1 text-sm opacity-90">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-sm opacity-80 transition hover:opacity-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AuthToast;
