import { TrendingUp, Target, Layers, BarChart2, ChevronRight, X } from 'lucide-react';
import { useCases } from '../data/useCases';

const ICONS = { TrendingUp, Target, Layers, BarChart2 };

function UseCaseCard({ useCase, onAsk }) {
  const Icon = ICONS[useCase.icon] || Layers;
  const prompt = `Tell me more about how Pathways can help me ${useCase.verb.toLowerCase()}: ${useCase.headline}`;

  return (
    <div className="border border-[#E0DDD7] bg-white rounded-xl overflow-hidden group hover:border-[#C8A84B] transition-colors">
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[rgba(200,168,75,0.12)] flex items-center justify-center flex-shrink-0">
            <Icon size={14} className="text-[#C8A84B]" />
          </div>
          <p className="text-[#1A1A1A] text-xs font-semibold leading-snug pt-0.5">
            {useCase.headline}
          </p>
        </div>
        <p className="text-[#6B6B6B] text-[11px] leading-relaxed line-clamp-3">
          {useCase.body}
        </p>
      </div>
      <button
        onClick={() => onAsk(prompt)}
        className="w-full flex items-center justify-between px-4 py-2 bg-[#F8F6F1] hover:bg-[rgba(200,168,75,0.08)] border-t border-[#F0EDE6] text-[11px] text-[#C8A84B] font-medium transition-colors"
      >
        Ask about this
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

export default function UseCasePanel({ open, onClose, onSend }) {
  if (!open) return null;

  // Group by group label
  const groups = useCases.reduce((acc, uc) => {
    if (!acc[uc.groupLabel]) acc[uc.groupLabel] = [];
    acc[uc.groupLabel].push(uc);
    return acc;
  }, {});

  return (
    <aside
      className="flex flex-col h-full border-l border-[#E0DDD7] bg-[#FAFAF8] overflow-y-auto scrollbar-thin flex-shrink-0"
      style={{ width: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E0DDD7] bg-white sticky top-0 z-10">
        <div>
          <h3 className="text-[#1A1A1A] text-sm font-semibold leading-none mb-0.5">Use cases</h3>
          <p className="text-[#6B6B6B] text-[10px]">What Pathways can help with</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB] rounded-lg transition-colors"
          aria-label="Close use cases"
        >
          <X size={13} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-4 space-y-5">
        {Object.entries(groups).map(([groupLabel, items]) => (
          <div key={groupLabel}>
            <p className="text-[#6B6B6B] text-[9px] uppercase tracking-widest font-semibold mb-2 px-1">
              {groupLabel}
            </p>
            <div className="space-y-2">
              {items.map((uc) => (
                <UseCaseCard key={uc.id} useCase={uc} onAsk={onSend} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
