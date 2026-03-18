import PromptBuilder from './PromptBuilder';
import PromptChips from './PromptChips';

export default function OnboardingState({ onChipClick, onSend }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-10">
      {/* Hero scope form */}
      <PromptBuilder variant="hero" onSend={onSend} />

      {/* Divider */}
      <div className="flex items-center gap-3 my-7 max-w-lg mx-auto">
        <div className="flex-1 h-px bg-[#E0DDD7]" />
        <span className="text-[#6B6B6B] text-xs">or jump straight in</span>
        <div className="flex-1 h-px bg-[#E0DDD7]" />
      </div>

      {/* Suggested chips */}
      <div className="max-w-lg mx-auto">
        <PromptChips onChipClick={onChipClick} />
      </div>
    </div>
  );
}
