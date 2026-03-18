import UseCaseTile from './UseCaseTile';
import PromptChips from './PromptChips';
import { useCases } from '../data/useCases';

export default function OnboardingState({ onChipClick, onInputChange, onSubmit, inputValue }) {
  const designingRightThings = useCases.filter((u) => u.group === 'designing-right-things');
  const designingThingsRight = useCases.filter((u) => u.group === 'designing-things-right');

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[#1A1A1A] text-2xl font-semibold tracking-tight mb-2">
            Pathways AI Assistant
          </h2>
          <p className="text-[#4A4A4A] text-sm max-w-md mx-auto">
            Ask me anything about the Pathways health segmentation platform
          </p>
        </div>

        {/* Use case tiles */}
        <div className="mb-2">
          {/* Group labels + grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left column — Designing the Right Things */}
            <div>
              <p className="text-[#6B6B6B] text-[10px] uppercase tracking-widest font-medium mb-2 text-center">
                Designing the Right Things
              </p>
              <div className="space-y-3">
                {designingRightThings.map((uc) => (
                  <UseCaseTile key={uc.id} useCase={uc} />
                ))}
              </div>
            </div>
            {/* Right column — Designing Things Right */}
            <div>
              <p className="text-[#6B6B6B] text-[10px] uppercase tracking-widest font-medium mb-2 text-center">
                Designing Things Right
              </p>
              <div className="space-y-3">
                {designingThingsRight.map((uc) => (
                  <UseCaseTile key={uc.id} useCase={uc} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested chips */}
        <div className="mt-8 mb-8">
          <PromptChips onChipClick={onChipClick} />
        </div>

        {/* Input area */}
        <div>
          <div className="flex gap-2 bg-white border border-[#E0DDD7] rounded-xl px-3 py-2 focus-within:border-[#C8A84B] focus-within:ring-2 focus-within:ring-[rgba(200,168,75,0.2)] transition-all shadow-sm">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="text-[#6B6B6B] text-[10px] text-center mt-2 leading-relaxed">
            Prompts around what data to use, answer focused on prompts to keep in mind as you continue
          </p>
        </div>
      </div>
    </div>
  );
}
