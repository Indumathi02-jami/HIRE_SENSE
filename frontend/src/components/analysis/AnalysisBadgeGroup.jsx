const AnalysisBadgeGroup = ({ title, items, tone = "cyan" }) => {
  if (!items?.length) {
    return null;
  }

  const toneClasses =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : "border-cyan-400/20 bg-cyan-500/10 text-cyan-100";

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${title}-${item}`}
            className={`rounded-full border px-3 py-2 text-sm font-medium backdrop-blur-xl ${toneClasses}`}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

export default AnalysisBadgeGroup;
