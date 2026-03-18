import { useState } from 'react';
import { ChevronDown, ChevronRight, Send, Sparkles } from 'lucide-react';
import UseCaseTile from './UseCaseTile';
import PromptChips from './PromptChips';
import { useCases } from '../data/useCases';
import { promptTemplates } from '../data/promptTemplates';

function TemplateHero({ template, onSend }) {
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
    <div className="bg-white border border-[#E0DDD7] rounded-2xl overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-[#F2F0EB] flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[rgba(200,168,75,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={15} className="text-[#C8A84B]" />
        </div>
        <div>
          <h3 className="text-[#1A1A1A] text-sm font-semibold leading-none mb-1">
            {template.name}
          </h3>
          <p className="text-[#6B6B6B] text-xs leading-relaxed">{template.description}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="px-5 py-4 space-y-3">
        {template.fields.map((field) => (
          <div key={field.id}>
            <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">
              {field.label}
              {field.required && <span className="text-[#C8A84B] ml-0.5">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              value={values[field.id]}
              onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full px-3 py-2.5 bg-[#FAFAF8] border border-[#E0DDD7] rounded-lg text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C8A84B] focus:ring-2 focus:ring-[rgba(200,168,75,0.15)] transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
        ))}

        <button
          onClick={handleSend}
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] disabled:text-[#6B6B6B] text-white text-sm font-semibold rounded-lg transition-colors mt-1"
        >
          <Send size={13} />
          Run deep dive
        </button>
      </div>
    </div>
  );
}

export default function OnboardingState({ onChipClick, onInputChange, onSubmit, inputValue }) {
  const [useCasesOpen, setUseCasesOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#1A1A1A] text-2xl font-semibold tracking-tight mb-2">
            Pathways AI Assistant
          </h2>
          <p className="text-[#4A4A4A] text-sm">
            Ask me anything about the Pathways health segmentation platform
          </p>
        </div>

        {/* Template hero cards */}
        <div className="space-y-3 mb-6">
          {promptTemplates.map((template) => (
            <TemplateHero key={template.id} template={template} onSend={onChipClick} />
          ))}
        </div>

        {/* Divider with "or ask freely" */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#E0DDD7]" />
          <span className="text-[#6B6B6B] text-xs">or ask freely</span>
          <div className="flex-1 h-px bg-[#E0DDD7]" />
        </div>

        {/* Suggested chips */}
        <div className="mb-5">
          <PromptChips onChipClick={onChipClick} />
        </div>

        {/* Free-text input */}
        <div className="mb-8">
          <div className="flex gap-2 bg-white border border-[#E0DDD7] rounded-xl px-3 py-2.5 focus-within:border-[#C8A84B] focus-within:ring-2 focus-within:ring-[rgba(200,168,75,0.15)] transition-all shadow-sm">
            <textarea
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Ask about Pathways health data..."
              rows={2}
              className="flex-1 bg-transparent text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] resize-none focus:outline-none leading-relaxed"
            />
            <button
              onClick={onSubmit}
              disabled={!inputValue.trim()}
              className="self-end p-2 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Use cases — tucked away */}
        <div className="border border-[#E0DDD7] rounded-xl overflow-hidden">
          <button
            onClick={() => setUseCasesOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#F2F0EB] hover:bg-[#E8E5DE] transition-colors"
            aria-expanded={useCasesOpen}
          >
            <span className="text-[#4A4A4A] text-xs font-medium">
              What can Pathways help with?
            </span>
            {useCasesOpen
              ? <ChevronDown size={14} className="text-[#6B6B6B]" />
              : <ChevronRight size={14} className="text-[#6B6B6B]" />
            }
          </button>
          {useCasesOpen && (
            <div className="px-4 py-4 bg-white grid grid-cols-2 gap-3">
              {useCases.map((uc) => (
                <UseCaseTile key={uc.id} useCase={uc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
