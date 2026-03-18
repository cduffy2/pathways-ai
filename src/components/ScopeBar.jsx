import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check, Globe, Heart, Database, Calendar } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';

const COUNTRIES = [
  'Bangladesh', 'Ethiopia', 'Ghana', 'India', 'Kenya', 'Malawi',
  'Mali', 'Mozambique', 'Nepal', 'Nigeria', 'Pakistan', 'Rwanda',
  'Senegal', 'Tanzania', 'Uganda', 'Zambia', 'Zimbabwe',
];

const HEALTH_AREAS = [
  'Maternal health', 'Newborn & child health', 'Nutrition', 'Family planning',
  'Immunisation', 'WASH', 'Malaria', 'HIV/AIDS', 'Mental health',
];

const DATA_SOURCES = [
  { id: 'all', label: 'Pathways + external' },
  { id: 'pathways-only', label: 'Pathways only' },
];

const VINTAGES = [
  { id: 'latest', label: 'Latest available' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2022', label: '2022' },
];

function MultiSelectDropdown({ icon: Icon, placeholder, options, selected, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
          hasSelection
            ? 'bg-[rgba(200,168,75,0.1)] border-[rgba(200,168,75,0.35)] text-[#1A1A1A]'
            : 'bg-white border-[#E0DDD7] text-[#6B6B6B] hover:border-[#C8C4BC] hover:text-[#1A1A1A]'
        }`}
        aria-expanded={open}
      >
        <Icon size={12} className={hasSelection ? 'text-[#C8A84B]' : ''} />
        <span className="max-w-[100px] truncate">
          {hasSelection
            ? selected.length === 1 ? selected[0] : `${selected[0]} +${selected.length - 1}`
            : placeholder}
        </span>
        {hasSelection ? (
          <span
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            className="text-[#6B6B6B] hover:text-[#C0392B] ml-0.5"
            role="button"
            aria-label={`Clear ${placeholder}`}
          >
            <X size={10} />
          </span>
        ) : (
          <ChevronDown size={10} />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-lg overflow-hidden min-w-[180px] max-h-60 overflow-y-auto scrollbar-thin">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                selected.includes(opt)
                  ? 'bg-[#C8A84B] border-[#C8A84B]'
                  : 'border-[#E0DDD7]'
              }`}>
                {selected.includes(opt) && <Check size={10} className="text-white" />}
              </div>
              <span className="text-[#1A1A1A]">{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SingleSelectDropdown({ icon: Icon, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = options.find((o) => o.id === selected) || options[0];
  const isNonDefault = selected !== options[0].id;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
          isNonDefault
            ? 'bg-[rgba(200,168,75,0.1)] border-[rgba(200,168,75,0.35)] text-[#1A1A1A]'
            : 'bg-white border-[#E0DDD7] text-[#6B6B6B] hover:border-[#C8C4BC] hover:text-[#1A1A1A]'
        }`}
        aria-expanded={open}
      >
        <Icon size={12} className={isNonDefault ? 'text-[#C8A84B]' : ''} />
        <span>{current.label}</span>
        <ChevronDown size={10} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-lg overflow-hidden min-w-[160px]">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
            >
              <Check
                size={11}
                className={`flex-shrink-0 ${selected === opt.id ? 'text-[#C8A84B]' : 'opacity-0'}`}
              />
              <span className="text-[#1A1A1A]">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScopeBar() {
  const { dataScope, setDataScope } = useConversation();
  const [expanded, setExpanded] = useState(false);

  const hasActiveScope =
    dataScope.countries.length > 0 ||
    dataScope.healthAreas.length > 0 ||
    dataScope.dataSource !== 'all' ||
    dataScope.vintage !== 'latest';

  const clearAll = () => {
    setDataScope({ countries: [], healthAreas: [], dataSource: 'all', vintage: 'latest' });
  };

  return (
    <div className={`border-b border-[#E0DDD7] bg-[#FAFAF8] transition-all ${expanded ? 'py-2.5' : 'py-1.5'}`}>
      <div className="px-4 flex items-center gap-2 flex-wrap">
        {/* Toggle button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            hasActiveScope
              ? 'bg-[rgba(200,168,75,0.12)] border-[rgba(200,168,75,0.3)] text-[#C8A84B]'
              : 'bg-white border-[#E0DDD7] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#C8C4BC]'
          }`}
          aria-expanded={expanded}
          aria-label="Data scope filters"
        >
          <SlidersHorizontal size={12} />
          <span>Scope data</span>
          {hasActiveScope && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A84B] ml-0.5" />
          )}
        </button>

        {/* Filters — shown when expanded or when there are active filters */}
        {(expanded || hasActiveScope) && (
          <>
            <MultiSelectDropdown
              icon={Globe}
              placeholder="Country"
              options={COUNTRIES}
              selected={dataScope.countries}
              onChange={(v) => setDataScope((s) => ({ ...s, countries: v }))}
            />
            <MultiSelectDropdown
              icon={Heart}
              placeholder="Health area"
              options={HEALTH_AREAS}
              selected={dataScope.healthAreas}
              onChange={(v) => setDataScope((s) => ({ ...s, healthAreas: v }))}
            />
            <SingleSelectDropdown
              icon={Database}
              options={DATA_SOURCES}
              selected={dataScope.dataSource}
              onChange={(v) => setDataScope((s) => ({ ...s, dataSource: v }))}
            />
            <SingleSelectDropdown
              icon={Calendar}
              options={VINTAGES}
              selected={dataScope.vintage}
              onChange={(v) => setDataScope((s) => ({ ...s, vintage: v }))}
            />

            {hasActiveScope && (
              <button
                onClick={clearAll}
                className="text-[#6B6B6B] text-[11px] hover:text-[#C0392B] transition-colors ml-1 underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </>
        )}

        {/* Active scope summary pill (when collapsed but active) */}
        {!expanded && hasActiveScope && (
          <p className="text-[#6B6B6B] text-[11px] ml-1">
            Filtering:{' '}
            {[
              dataScope.countries.length > 0 && `${dataScope.countries.length} countr${dataScope.countries.length > 1 ? 'ies' : 'y'}`,
              dataScope.healthAreas.length > 0 && `${dataScope.healthAreas.length} health area${dataScope.healthAreas.length > 1 ? 's' : ''}`,
              dataScope.dataSource === 'pathways-only' && 'Pathways only',
              dataScope.vintage !== 'latest' && dataScope.vintage,
            ].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
