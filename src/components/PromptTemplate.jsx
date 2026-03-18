import { useState } from 'react';
import { ChevronDown, ChevronRight, Send } from 'lucide-react';

function TemplateForm({ template, onSend }) {
  const initialValues = Object.fromEntries(template.fields.map((f) => [f.id, '']));
  const [values, setValues] = useState(initialValues);

  const isValid = template.fields
    .filter((f) => f.required)
    .every((f) => values[f.id].trim().length > 0);

  const handleSend = () => {
    if (!isValid) return;
    onSend(template.buildPrompt(values));
    setValues(initialValues);
  };

  return (
    <div className="pt-3 space-y-3">
      <p className="text-[#6B6B6B] text-[11px] leading-relaxed">
        {template.description}
      </p>
      {template.fields.map((field) => (
        <div key={field.id}>
          <label className="block text-[#4A4A4A] text-[11px] font-medium mb-1">
            {field.label}
            {field.required && <span className="text-[#C8A84B] ml-0.5">*</span>}
          </label>
          <input
            type={field.type || 'text'}
            value={values[field.id]}
            onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
            placeholder={field.placeholder}
            className="w-full px-2.5 py-2 bg-[#FAFAF8] border border-[#E0DDD7] rounded-md text-[#1A1A1A] text-xs placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
      ))}
      <button
        onClick={handleSend}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] disabled:text-[#6B6B6B] text-white text-xs font-medium rounded-md transition-colors"
      >
        <Send size={12} />
        Send prompt
      </button>
    </div>
  );
}

export default function PromptTemplate({ template, onSend }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#E0DDD7] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#F2F0EB] hover:bg-[#E8E5DE] text-left transition-colors"
        aria-expanded={open}
      >
        <span className="flex-1 text-[#1A1A1A] text-xs font-medium">{template.name}</span>
        {open ? (
          <ChevronDown size={12} className="text-[#6B6B6B] flex-shrink-0" />
        ) : (
          <ChevronRight size={12} className="text-[#6B6B6B] flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 bg-white">
          <TemplateForm template={template} onSend={onSend} />
        </div>
      )}
    </div>
  );
}
