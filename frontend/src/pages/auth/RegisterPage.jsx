import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import AuthInput from "../../components/auth/AuthInput";
import AuthShell from "../../components/auth/AuthShell";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import AuthToast from "../../components/auth/AuthToast";
import useToast from "../../hooks/useToast";
import { registerUser as registerUserRequest } from "../../services/authApi";
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword
} from "../../utils/authValidation";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8Z" />
    <path d="M5 20a7 7 0 0114 0" />
  </svg>
);

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

const RegisterPage = ({ onNavigateToLogin, onSubmit = registerUserRequest, onSuccess }) => {
  const { toasts, pushToast, dismissToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const errors = useMemo(
    () => ({
      fullName: touched.fullName ? validateFullName(values.fullName) : "",
      email: touched.email ? validateEmail(values.email) : "",
      password: touched.password ? validatePassword(values.password) : "",
      confirmPassword: touched.confirmPassword
        ? validateConfirmPassword(values.password, values.confirmPassword)
        : ""
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

  const hasErrors = Boolean(
    validateFullName(values.fullName) ||
      validateEmail(values.email) ||
      validatePassword(values.password) ||
      validateConfirmPassword(values.password, values.confirmPassword)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (hasErrors) {
      pushToast("Please review the highlighted fields before creating your account.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await onSubmit(values);
      pushToast(response.message || "Registration successful.", "success");
      window.setTimeout(() => {
        onSuccess?.(response.data);
      }, 500);
    } catch (error) {
      pushToast(error.message || "Registration failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthToast toasts={toasts} onDismiss={dismissToast} />
      <AuthShell
        eyebrow="Create workspace"
        title="Start with HireSense AI"
        description="Set up your account and give your team a refined, AI-first hiring experience from day one."
        footer={
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-cyan-200 transition hover:text-white"
            >
              Sign in
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
            label="Full name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Avery Morgan"
            autoComplete="name"
            error={errors.fullName}
            icon={<UserIcon />}
          />

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password}
            icon={<LockIcon />}
          />

          <AuthInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            icon={<LockIcon />}
          />

          <p className="pb-2 pt-1 text-sm leading-6 text-slate-400">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>

          <AuthSubmitButton type="submit" isLoading={isLoading} loadingText="Creating account...">
            Create account
          </AuthSubmitButton>
        </motion.form>
      </AuthShell>
    </>
  );
};

export default RegisterPage;
