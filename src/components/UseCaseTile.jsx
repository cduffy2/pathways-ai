import { TrendingUp, Target, Layers, BarChart2 } from 'lucide-react';

const iconMap = {
  TrendingUp,
  Target,
  Layers,
  BarChart2,
};

export default function UseCaseTile({ useCase }) {
  const Icon = iconMap[useCase.icon];

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-[#E0DDD7] rounded-xl hover:border-[rgba(200,168,75,0.4)] hover:shadow-sm transition-all group">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[rgba(200,168,75,0.12)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(200,168,75,0.2)] transition-colors">
          {Icon && <Icon size={16} className="text-[#C8A84B]" />}
        </div>
        <span className="text-[#C8A84B] text-xs font-semibold uppercase tracking-wider">
          {useCase.verb}
        </span>
      </div>
      <div>
        <h3 className="text-[#1A1A1A] text-sm font-semibold leading-snug mb-1.5">
          {useCase.headline}
        </h3>
        <p className="text-[#4A4A4A] text-xs leading-relaxed">
          {useCase.body}
        </p>
      </div>
    </div>
  );
}
