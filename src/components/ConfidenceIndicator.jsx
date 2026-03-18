const LEVELS = {
  high: {
    label: 'High confidence',
    color: '#27AE60',
    bg: 'rgba(39,174,96,0.1)',
    bars: 3,
  },
  medium: {
    label: 'Medium confidence',
    color: '#C8A84B',
    bg: 'rgba(200,168,75,0.12)',
    bars: 2,
  },
  low: {
    label: 'Low confidence',
    color: '#C0392B',
    bg: 'rgba(192,57,43,0.1)',
    bars: 1,
  },
};

export default function ConfidenceIndicator({ level = 'high', explanation }) {
  const config = LEVELS[level] || LEVELS.high;

  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: config.bg, border: `1px solid ${config.color}22` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {/* Bar chart icon */}
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className="w-1 rounded-sm"
              style={{
                height: `${bar * 33}%`,
                background: bar <= config.bars ? config.color : '#E0DDD7',
              }}
            />
          ))}
        </div>
        <span className="text-xs font-semibold" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>
      {explanation && (
        <p className="text-[#4A4A4A] text-[11px] leading-relaxed">{explanation}</p>
      )}
    </div>
  );
}
