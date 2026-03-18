import { suggestedChips } from '../data/useCases';

export default function PromptChips({ onChipClick }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestedChips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick(chip)}
          className="px-3 py-1.5 bg-white border border-[#E0DDD7] hover:border-[#C8A84B] hover:bg-[rgba(200,168,75,0.05)] text-[#4A4A4A] text-xs rounded-full transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
