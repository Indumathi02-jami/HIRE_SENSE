import { Link } from "react-router-dom";

const Logo = ({ compact = false }) => (
  <Link to="/" className="flex items-center gap-3 text-white">
    <span className={`flex ${compact ? "h-10 w-10" : "h-12 w-12"} items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm font-semibold shadow-[0_12px_32px_rgba(8,47,73,0.22)]`}>
      H
    </span>
    {!compact && (
      <div>
        <p className="text-base font-semibold tracking-wide">HireSense AI</p>
        <p className="text-sm text-slate-400">Interview intelligence</p>
      </div>
    )}
  </Link>
);

export default Logo;
