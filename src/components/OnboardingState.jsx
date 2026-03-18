import PromptChips from './PromptChips';

export default function OnboardingState({ onChipClick }) {
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
            Scope your analysis with the controls above, or start with a suggested question below.
          </p>
        </div>

        {/* Suggested starters */}
        <div>
          <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold text-center mb-3">
            Suggested questions
          </p>
          <PromptChips onChipClick={onChipClick} />
        </div>
      </div>
    </div>
  );
}
