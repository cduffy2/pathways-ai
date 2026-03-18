import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, ChevronDown } from 'lucide-react';
import { promptTemplates } from '../data/promptTemplates';

function TemplatePanel({ template, onSend, onClose }) {
  const initialValues = Object.fromEntries(template.fields.map((f) => [f.id, '']));
  const [values, setValues] = useState(initialValues);
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const isValid = template.fields
    .filter((f) => f.required)
    .every((f) => values[f.id].trim().length > 0);

  const handleSend = () => {
    if (!isValid) return;
    onSend(template.buildPrompt(values));
    onClose();
  };

  return (
    <div className="space-y-3">
      <p className="text-[#6B6B6B] text-xs leading-relaxed">{template.description}</p>
      {template.fields.map((field, i) => (
        <div key={field.id}>
          <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">
            {field.label}
            {field.required && <span className="text-[#C8A84B] ml-0.5">*</span>}
          </label>
          <input
            ref={i === 0 ? firstInputRef : null}
            type={field.type || 'text'}
            value={values[field.id]}
            onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
            placeholder={field.placeholder}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full px-3 py-2.5 bg-[#FAFAF8] border border-[#E0DDD7] rounded-lg text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A84B] focus:ring-2 focus:ring-[rgba(200,168,75,0.15)] transition-colors"
          />
        </div>
      ))}
      <button
        onClick={handleSend}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] disabled:text-[#6B6B6B] text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Send size={13} />
        Run prompt
      </button>
    </div>
  );
}

export default function PromptLauncher({ onSend }) {
  const [open, setOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const panelRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    // Auto-select first template if only one
    if (promptTemplates.length === 1) setActiveTemplate(promptTemplates[0].id);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          open
            ? 'bg-[rgba(200,168,75,0.15)] text-[#C8A84B] border border-[rgba(200,168,75,0.3)]'
            : 'text-[#6B6B6B] hover:bg-[#F2F0EB] hover:text-[#1A1A1A] border border-transparent'
        }`}
        aria-expanded={open}
        aria-label="Open prompt templates"
      >
        <Sparkles size={13} />
        Prompts
        <ChevronDown
          size={11}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating panel — drops down from toolbar */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden"
          style={{ width: 320 }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F2F0EB]">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#C8A84B]" />
              <span className="text-[#1A1A1A] text-sm font-semibold">Prompt templates</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB] rounded-md transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {/* Template list */}
          {!activeTemplate ? (
            <div className="p-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setActiveTemplate(template.id)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F2F0EB] text-left transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-[rgba(200,168,75,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(200,168,75,0.2)] transition-colors">
                    <Sparkles size={12} className="text-[#C8A84B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A1A1A] text-xs font-medium leading-none mb-0.5">
                      {template.name}
                    </p>
                    <p className="text-[#6B6B6B] text-[10px] leading-snug line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              {/* Back link */}
              {promptTemplates.length > 1 && (
                <button
                  onClick={() => setActiveTemplate(null)}
                  className="flex items-center gap-1 text-[#6B6B6B] text-[11px] mb-3 hover:text-[#1A1A1A] transition-colors"
                >
                  ← Back
                </button>
              )}
              <p className="text-[#1A1A1A] text-sm font-semibold mb-3">
                {promptTemplates.find((t) => t.id === activeTemplate)?.name}
              </p>
              <TemplatePanel
                template={promptTemplates.find((t) => t.id === activeTemplate)}
                onSend={onSend}
                onClose={() => setOpen(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
