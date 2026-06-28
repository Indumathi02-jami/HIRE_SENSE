import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import AuthInput from "../../components/auth/AuthInput";
import AuthShell from "../../components/auth/AuthShell";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import AuthToast from "../../components/auth/AuthToast";
import useToast from "../../hooks/useToast";
import { loginUser as loginUserRequest } from "../../services/authApi";
import { validateEmail, validatePassword } from "../../utils/authValidation";

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M4 6h16v12H4z" />
    <path d="M4 8l8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 118 0v3" />
  </svg>
);

const LoginPage = ({ onNavigateToRegister, onSubmit = loginUserRequest, onSuccess }) => {
  const { toasts, pushToast, dismissToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const errors = useMemo(
    () => ({
      email: touched.email ? validateEmail(values.email) : "",
      password: touched.password ? validatePassword(values.password) : ""
    }),
    [touched, values]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const hasErrors = Boolean(validateEmail(values.email) || validatePassword(values.password));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      email: true,
      password: true
    });

    if (hasErrors) {
      pushToast("Please fix the highlighted fields before continuing.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await onSubmit(values);
      pushToast(response.message || "Login successful.", "success");
      window.setTimeout(() => {
        onSuccess?.(response.data);
      }, 500);
    } catch (error) {
      pushToast(error.message || "Login failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthToast toasts={toasts} onDismiss={dismissToast} />
      <AuthShell
        eyebrow="Secure access"
        title="Sign in to HireSense AI"
        description="Continue to your hiring workspace with a frictionless, high-trust sign-in experience."
        footer={
          <p>
            New to HireSense AI?{" "}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-semibold text-cyan-200 transition hover:text-white"
            >
              Create an account
            </button>
          </p>
        }
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.08 }}
          className="space-y-2"
        >
          <AuthInput
            label="Work email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@company.com"
            autoComplete="email"
            error={errors.email}
            icon={<EmailIcon />}
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            icon={<LockIcon />}
          />

          <div className="flex items-center justify-between gap-3 pb-2 pt-1 text-sm text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5" />
              <span>Remember me</span>
            </label>
            <button type="button" className="transition hover:text-white">
              Forgot password?
            </button>
          </div>

          <AuthSubmitButton type="submit" isLoading={isLoading} loadingText="Signing you in...">
            Sign in
          </AuthSubmitButton>
        </motion.form>
      </AuthShell>
    </>
  );
};

export default LoginPage;
