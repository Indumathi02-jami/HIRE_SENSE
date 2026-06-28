/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 25px 60px rgba(56, 189, 248, 0.18)",
        glass: "0 30px 80px rgba(15, 23, 42, 0.45)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.25)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.25)",
        "glow-emerald": "0 0 20px rgba(16, 185, 129, 0.25)",
        "glow-rose": "0 0 20px rgba(244, 63, 94, 0.25)",
        "glass-premium": "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseRing: {
          "0%": { transform: "scale(0.96)", opacity: "0.45" },
          "100%": { transform: "scale(1.08)", opacity: "0" }
        },
        popIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        gradientShift: {
          "0%, 100%": { transform: "translate3d(0%, 0%, 0) scale(1)" },
          "50%": { transform: "translate3d(3%, -2%, 0) scale(1.06)" }
        },
        shakeX: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        popIn: "popIn 280ms ease-out forwards",
        gradientShift: "gradientShift 16s ease-in-out infinite",
        shakeX: "shakeX 320ms ease-in-out"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(34,211,238,0.16), transparent 32%), radial-gradient(circle at 80% 10%, rgba(59,130,246,0.18), transparent 28%), linear-gradient(180deg, rgba(15,23,42,0.94) 0%, rgba(2,6,23,1) 100%)"
      }
    }
  },
  plugins: []
};
