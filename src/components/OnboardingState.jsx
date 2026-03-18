import PromptChips from './PromptChips';

export default function OnboardingState({ onChipClick, onInputChange, onSubmit, inputValue }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* Welcome copy */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#C8A84B] flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C5.239 2 3 4.239 3 7c0 1.657.806 3.124 2.044 4.033L4.5 14h7l-.544-2.967C12.194 10.124 13 8.657 13 7c0-2.761-2.239-5-5-5z" fill="white" fillOpacity="0.9"/>
              <circle cx="8" cy="7" r="2" fill="#C8A84B"/>
            </svg>
          </div>
          <h2 className="text-[#1A1A1A] text-xl font-semibold tracking-tight mb-2">
            Pathways AI Assistant
          </h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed max-w-sm mx-auto">
            Use the scope bar above to focus your analysis by country, health area, or population segment, then ask anything below.
          </p>
        </div>

        {/* Suggested starters */}
        <div className="mb-6">
          <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold text-center mb-3">
            Suggested questions
          </p>
          <PromptChips onChipClick={onChipClick} />
        </div>

        {/* Free-text input */}
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
            placeholder="Ask about Pathways health data…"
            rows={2}
            className="flex-1 bg-transparent text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] resize-none focus:outline-none leading-relaxed"
          />
          <button
            onClick={onSubmit}
            disabled={!inputValue.trim()}
            className="self-end p-2 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] text-white rounded-lg transition-colors flex-shrink-0"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
