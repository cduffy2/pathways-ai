import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { availableModels } from '../data/promptTemplates';

export default function ModelSelector({ selectedModel, onModelChange, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (compact) {
    // Inline pill for the header bar
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-[#E0DDD7] bg-[#F2F0EB] hover:bg-[#E8E5DE] rounded-lg text-xs text-[#1A1A1A] font-medium transition-colors"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="max-w-[120px] truncate">{current.label}</span>
          <ChevronDown size={11} className="text-[#6B6B6B] flex-shrink-0" />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute top-full right-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[220px]"
          >
            {availableModels.map((model) => (
              <button
                key={model.id}
                role="option"
                aria-selected={model.id === selectedModel}
                onClick={() => { onModelChange(model.id); setOpen(false); }}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-[#F2F0EB] text-left transition-colors"
              >
                <Check
                  size={12}
                  className={`mt-0.5 flex-shrink-0 ${model.id === selectedModel ? 'text-[#C8A84B]' : 'opacity-0'}`}
                />
                <div className="min-w-0">
                  <p className="text-[#1A1A1A] text-xs font-medium leading-none mb-0.5">{model.label}</p>
                  <p className="text-[#6B6B6B] text-[10px] leading-tight">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Legacy sidebar version (not used but kept for safety)
  return (
    <div className="px-3 py-3 border-b border-[#E0DDD7]" ref={ref}>
      <label className="block text-[#6B6B6B] text-[10px] uppercase tracking-wider font-medium mb-1.5">
        Model
      </label>
      <div className="relative">
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
                onClick={() => { onModelChange(model.id); setOpen(false); }}
                className="w-full flex items-start gap-2 px-3 py-2.5 hover:bg-[#F2F0EB] text-left transition-colors"
              >
                <Check
                  size={12}
                  className={`mt-0.5 flex-shrink-0 ${model.id === selectedModel ? 'text-[#C8A84B]' : 'opacity-0'}`}
                />
                <div className="min-w-0">
                  <p className="text-[#1A1A1A] text-xs font-medium leading-none mb-0.5">{model.label}</p>
                  <p className="text-[#6B6B6B] text-[10px] leading-tight">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
