import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";

const EyeIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {open ? (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
        <path d="M9.88 5.09A11.2 11.2 0 0112 5c6.5 0 10 7 10 7a17.48 17.48 0 01-3.06 3.73" />
        <path d="M6.61 6.61A17.31 17.31 0 002 12s3.5 7 10 7a10.9 10.9 0 004.24-.82" />
      </>
    )}
  </svg>
);

const AuthInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  autoComplete
}) => {
  const inputId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const resolvedType = useMemo(() => {
    if (!isPassword) {
      return type;
    }

    // The visibility toggle only changes how the password is displayed.
    // The same field value still flows through validation and submission.
    return showPassword ? "text" : "password";
  }, [isPassword, showPassword, type]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className={error ? "animate-shakeX" : ""}
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div
        className={`group flex items-center rounded-2xl border px-4 transition duration-300 ${
          error
            ? "border-rose-400/70 bg-rose-500/10"
            : "border-white/10 bg-slate-950/40 hover:border-cyan-300/25 focus-within:border-cyan-400/40 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.12)]"
        }`}
      >
        {icon ? (
          <span className="mr-3 text-slate-400 transition group-focus-within:text-cyan-200">
            {icon}
          </span>
        ) : null}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="ml-3 text-slate-400 transition hover:text-slate-100"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        ) : null}
      </div>

      <div className="mt-2 min-h-[20px]">
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </div>
    </motion.div>
  );
};

export default AuthInput;
