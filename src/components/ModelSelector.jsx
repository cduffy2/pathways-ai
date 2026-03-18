import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Info, Check } from 'lucide-react';
import { availableModels } from '../data/promptTemplates';

export default function ModelSelector({ selectedModel, onModelChange }) {
  const [open, setOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const dropdownRef = useRef(null);

  const current = availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="px-3 py-3 border-b border-[#E0DDD7]">
      <div className="flex items-center gap-1 mb-1.5">
        <label className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-medium">
          Model
        </label>
        <div className="relative">
          <button
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            className="text-[#6B6B6B] hover:text-[#4A4A4A] transition-colors"
            aria-label="Model info"
          >
            <Info size={11} />
          </button>
          {tooltipVisible && (
            <div className="absolute left-5 top-0 z-50 w-52 bg-[#1A1A1A] text-white text-[11px] rounded-lg px-3 py-2 leading-relaxed shadow-lg">
              The model controls how the assistant processes and synthesises health data.
              More capable models handle complex multi-country queries better.
            </div>
          )}
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#F2F0EB] hover:bg-[#E8E5DE] border border-[#E0DDD7] rounded-lg text-[#1A1A1A] text-xs transition-colors"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="truncate font-medium">{current.label}</span>
          <ChevronDown size={12} className="flex-shrink-0 text-[#6B6B6B]" />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-[#E0DDD7] rounded-lg shadow-lg overflow-hidden"
          >
            {availableModels.map((model) => (
              <button
                key={model.id}
                role="option"
                aria-selected={model.id === selectedModel}
                onClick={() => {
                  onModelChange(model.id);
                  setOpen(false);
                }}
                className="w-full flex items-start gap-2 px-3 py-2.5 hover:bg-[#F2F0EB] text-left transition-colors"
              >
                <Check
                  size={12}
                  className={`mt-0.5 flex-shrink-0 ${
                    model.id === selectedModel ? 'text-[#C8A84B]' : 'opacity-0'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[#1A1A1A] text-xs font-medium leading-none mb-0.5">
                    {model.label}
                  </p>
                  <p className="text-[#6B6B6B] text-[10px] leading-tight">
                    {model.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
