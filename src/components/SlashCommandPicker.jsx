import { useEffect, useRef } from 'react';
import { Wrench, CornerDownLeft } from 'lucide-react';

export default function SlashCommandPicker({ tools, query, activeIndex, onSelect, onActiveChange }) {
  const listRef = useRef(null);

  const filtered = tools.filter(
    (t) =>
      query === '' ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (filtered.length === 0) return null;

  return (
    <div
      className="absolute bottom-full left-0 right-0 mb-1.5 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden"
      role="listbox"
      aria-label="Slash commands"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#F2F0EB]">
        <div className="flex items-center gap-1.5">
          <Wrench size={11} className="text-[#C8A84B]" />
          <span className="text-[#6B6B6B] text-[10px] font-semibold uppercase tracking-wider">
            MCP Tools
          </span>
        </div>
        <span className="text-[#6B6B6B] text-[10px]">
          <CornerDownLeft size={10} className="inline mr-0.5" />
          to select
        </span>
      </div>

      {/* Tool list */}
      <div ref={listRef} className="max-h-52 overflow-y-auto scrollbar-thin py-1">
        {filtered.map((tool, i) => (
          <button
            key={tool.name}
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => onActiveChange(i)}
            onClick={() => onSelect(tool)}
            className={`w-full flex items-start gap-3 px-3 py-2 text-left transition-colors ${
              i === activeIndex ? 'bg-[#F2F0EB]' : 'hover:bg-[#F8F6F1]'
            }`}
          >
            {/* Tool name */}
            <span className="flex-shrink-0 font-mono text-[11px] text-[#C8A84B] font-semibold mt-0.5 min-w-[160px]">
              /{tool.name}
            </span>
            {/* Description */}
            <span className="text-[#6B6B6B] text-[11px] leading-snug">
              {tool.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
