import { useState, useRef, useEffect } from 'react';
import {
  Globe, Heart, Users, Database, Calendar,
  X, ChevronDown, Check, ArrowRight, SlidersHorizontal,
} from 'lucide-react';
import { useConversation } from '../hooks/useConversation';

// ─── Static data ─────────────────────────────────────────────────────────────

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
  { id: 'all', label: 'All data' },
  { id: 'pathways-only', label: 'Pathways only' },
];

const VINTAGES = [
  { id: 'latest', label: 'Latest' },
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2022', label: '2022' },
];

// ─── Shared dropdown hook ────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return { open, setOpen, ref };
}

// ─── Shared dropdown lists ───────────────────────────────────────────────────

function MultiSelectList({ options, selected, onChange }) {
  const toggle = (val) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  return (
    <>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
        >
          <div className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
            selected.includes(opt) ? 'bg-[#C8A84B] border-[#C8A84B]' : 'border-[#D8D5CF]'
          }`}>
            {selected.includes(opt) && <Check size={8} className="text-white" />}
          </div>
          <span className="text-[#1A1A1A]">{opt}</span>
        </button>
      ))}
    </>
  );
}

function SingleSelectList({ options, selected, onChange, onClose }) {
  return (
    <>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => { onChange(opt.id); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
        >
          <Check size={10} className={`flex-shrink-0 ${selected === opt.id ? 'text-[#C8A84B]' : 'opacity-0'}`} />
          <span className="text-[#1A1A1A]">{opt.label}</span>
        </button>
      ))}
    </>
  );
}

// ─── Compact variant ─────────────────────────────────────────────────────────

function FilterPill({ icon: Icon, label, active, onClick, onClear }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 pl-2 ${active ? 'pr-1' : 'pr-2'} py-1 rounded-md text-[11px] font-medium transition-all border ${
        active
          ? 'bg-white border-[#C8A84B] text-[#1A1A1A] shadow-sm'
          : 'bg-transparent border-[#D8D5CF] text-[#6B6B6B] hover:border-[#B8B5AF] hover:text-[#4A4A4A]'
      }`}
    >
      <Icon size={11} className={active ? 'text-[#C8A84B]' : ''} />
      <span className="max-w-[90px] truncate ml-0.5">{label}</span>
      {active && (
        <span
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="ml-0.5 p-0.5 rounded hover:bg-[#F2F0EB] text-[#6B6B6B] hover:text-[#C0392B] transition-colors"
          role="button"
          aria-label="Clear"
        >
          <X size={9} />
        </span>
      )}
    </button>
  );
}

function CompactBar({ dataScope, setDataScope, onSend }) {
  const countryDrop = useDropdown();
  const healthDrop = useDropdown();
  const sourceDrop = useDropdown();
  const vintageDrop = useDropdown();
  const set = (key) => (val) => setDataScope((s) => ({ ...s, [key]: val }));

  const countryLabel = dataScope.countries.length === 0
    ? 'Country'
    : dataScope.countries.length === 1 ? dataScope.countries[0]
    : `${dataScope.countries[0]} +${dataScope.countries.length - 1}`;

  const healthLabel = dataScope.healthAreas.length === 0
    ? 'Health area'
    : dataScope.healthAreas.length === 1 ? dataScope.healthAreas[0]
    : `${dataScope.healthAreas[0]} +${dataScope.healthAreas.length - 1}`;

  const currentSource = DATA_SOURCES.find((s) => s.id === dataScope.dataSource) || DATA_SOURCES[0];
  const currentVintage = VINTAGES.find((v) => v.id === dataScope.vintage) || VINTAGES[0];

  const hasScope =
    dataScope.countries.length > 0 ||
    dataScope.healthAreas.length > 0 ||
    dataScope.segment.trim() ||
    dataScope.dataSource !== 'all' ||
    dataScope.vintage !== 'latest';

  const clearAll = () => setDataScope({ countries: [], healthAreas: [], segment: '', dataSource: 'all', vintage: 'latest' });

  const buildAndSend = () => {
    const parts = [];
    if (dataScope.countries.length > 0) parts.push(`Country: ${dataScope.countries.join(', ')}`);
    if (dataScope.healthAreas.length > 0) parts.push(`Health area: ${dataScope.healthAreas.join(', ')}`);
    if (dataScope.segment.trim()) parts.push(`Population / segment: ${dataScope.segment.trim()}`);
    if (dataScope.dataSource === 'pathways-only') parts.push('Use Pathways data only.');
    if (dataScope.vintage !== 'latest') parts.push(`Data vintage: ${dataScope.vintage}.`);
    onSend(`Please provide a deep dive analysis with the following scope:\n${parts.join('\n')}`);
  };

  return (
    <div className="border-b border-[#E0DDD7] bg-[#F8F6F1] px-4 py-2 flex-shrink-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold mr-1">Scope</span>

        {/* Country */}
        <div className="relative">
          <FilterPill icon={Globe} label={countryLabel} active={dataScope.countries.length > 0}
            onClick={() => countryDrop.setOpen((v) => !v)} onClear={() => set('countries')([])} />
          {countryDrop.open && (
            <div ref={countryDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[180px] max-h-60 overflow-y-auto scrollbar-thin py-1">
              <MultiSelectList options={COUNTRIES} selected={dataScope.countries} onChange={set('countries')} />
            </div>
          )}
        </div>

        {/* Health area */}
        <div className="relative">
          <FilterPill icon={Heart} label={healthLabel} active={dataScope.healthAreas.length > 0}
            onClick={() => healthDrop.setOpen((v) => !v)} onClear={() => set('healthAreas')([])} />
          {healthDrop.open && (
            <div ref={healthDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[180px] max-h-60 overflow-y-auto scrollbar-thin py-1">
              <MultiSelectList options={HEALTH_AREAS} selected={dataScope.healthAreas} onChange={set('healthAreas')} />
            </div>
          )}
        </div>

        {/* Segment */}
        <div className="flex items-center gap-1 border border-[#D8D5CF] hover:border-[#B8B5AF] bg-transparent rounded-md px-2 py-1 transition-colors focus-within:border-[#C8A84B] focus-within:bg-white">
          <Users size={11} className="text-[#6B6B6B] flex-shrink-0" />
          <input
            value={dataScope.segment}
            onChange={(e) => set('segment')(e.target.value)}
            placeholder="Segment"
            className="bg-transparent text-[11px] text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none w-24"
          />
          {dataScope.segment && (
            <button onClick={() => set('segment')('')} className="text-[#6B6B6B] hover:text-[#C0392B]">
              <X size={9} />
            </button>
          )}
        </div>

        <div className="w-px h-4 bg-[#D8D5CF] mx-0.5" />

        {/* Source */}
        <div className="relative">
          <FilterPill icon={Database} label={currentSource.label} active={dataScope.dataSource !== 'all'}
            onClick={() => sourceDrop.setOpen((v) => !v)} onClear={() => set('dataSource')('all')} />
          {sourceDrop.open && (
            <div ref={sourceDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[150px] py-1">
              <SingleSelectList options={DATA_SOURCES} selected={dataScope.dataSource} onChange={set('dataSource')} onClose={() => sourceDrop.setOpen(false)} />
            </div>
          )}
        </div>

        {/* Vintage */}
        <div className="relative">
          <FilterPill icon={Calendar} label={currentVintage.label} active={dataScope.vintage !== 'latest'}
            onClick={() => vintageDrop.setOpen((v) => !v)} onClear={() => set('vintage')('latest')} />
          {vintageDrop.open && (
            <div ref={vintageDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[130px] py-1">
              <SingleSelectList options={VINTAGES} selected={dataScope.vintage} onChange={set('vintage')} onClose={() => vintageDrop.setOpen(false)} />
            </div>
          )}
        </div>

        {hasScope && (
          <>
            <div className="w-px h-4 bg-[#D8D5CF] mx-0.5" />
            <button onClick={clearAll} className="text-[#6B6B6B] text-[10px] hover:text-[#C0392B] transition-colors">Clear</button>
            <button onClick={buildAndSend} className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-[#C8A84B] hover:bg-[#B89638] text-white text-[11px] font-semibold rounded-md transition-colors">
              <ArrowRight size={11} /> Ask
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Hero variant ─────────────────────────────────────────────────────────────

function HeroDropdown({ icon: Icon, label, value, placeholder, onClick, onClear }) {
  const hasValue = Boolean(value);
  return (
    <div>
      <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">{label}</label>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm transition-all text-left ${
          hasValue
            ? 'bg-white border-[#C8A84B] shadow-sm'
            : 'bg-white border-[#E0DDD7] hover:border-[#C8C4BC]'
        }`}
      >
        <Icon size={15} className={hasValue ? 'text-[#C8A84B] flex-shrink-0' : 'text-[#6B6B6B] flex-shrink-0'} />
        <span className={`flex-1 truncate ${hasValue ? 'text-[#1A1A1A] font-medium' : 'text-[#6B6B6B]'}`}>
          {value || placeholder}
        </span>
        {hasValue
          ? <span onClick={(e) => { e.stopPropagation(); onClear(); }} className="text-[#6B6B6B] hover:text-[#C0392B] transition-colors" role="button"><X size={13} /></span>
          : <ChevronDown size={13} className="text-[#6B6B6B]" />
        }
      </button>
    </div>
  );
}

function HeroForm({ dataScope, setDataScope, onSend }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const countryDrop = useDropdown();
  const healthDrop = useDropdown();
  const sourceDrop = useDropdown();
  const vintageDrop = useDropdown();
  const set = (key) => (val) => setDataScope((s) => ({ ...s, [key]: val }));

  const countryValue = dataScope.countries.length === 0
    ? null
    : dataScope.countries.length === 1 ? dataScope.countries[0]
    : `${dataScope.countries[0]} + ${dataScope.countries.length - 1} more`;

  const healthValue = dataScope.healthAreas.length === 0
    ? null
    : dataScope.healthAreas.length === 1 ? dataScope.healthAreas[0]
    : `${dataScope.healthAreas[0]} + ${dataScope.healthAreas.length - 1} more`;

  const currentSource = DATA_SOURCES.find((s) => s.id === dataScope.dataSource) || DATA_SOURCES[0];
  const currentVintage = VINTAGES.find((v) => v.id === dataScope.vintage) || VINTAGES[0];

  const handleExplore = () => {
    const parts = [];
    if (dataScope.countries.length > 0) parts.push(`Country: ${dataScope.countries.join(', ')}`);
    if (dataScope.healthAreas.length > 0) parts.push(`Health area: ${dataScope.healthAreas.join(', ')}`);
    if (dataScope.segment.trim()) parts.push(`Population / segment: ${dataScope.segment.trim()}`);
    if (dataScope.dataSource === 'pathways-only') parts.push('Use Pathways data only.');
    if (dataScope.vintage !== 'latest') parts.push(`Data vintage: ${dataScope.vintage}.`);
    const prompt = parts.length > 0
      ? `Please provide a deep dive analysis with the following scope:\n${parts.join('\n')}`
      : 'Give me an overview of what the Pathways health segmentation platform covers.';
    onSend(prompt);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white border border-[#E0DDD7] rounded-2xl shadow-sm overflow-visible">
        <div className="px-6 py-5">
          {/* Heading */}
          <div className="mb-5">
            <h3 className="text-[#1A1A1A] text-base font-semibold leading-tight mb-1">
              Set your focus
            </h3>
            <p className="text-[#6B6B6B] text-xs leading-relaxed">
              Scope your analysis — or jump straight to the questions below.
            </p>
          </div>

          {/* Country + Health area */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Country */}
            <div className="relative">
              <HeroDropdown
                icon={Globe} label="Country" placeholder="Any country"
                value={countryValue}
                onClick={() => countryDrop.setOpen((v) => !v)}
                onClear={() => set('countries')([])}
              />
              {countryDrop.open && (
                <div ref={countryDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden w-full max-h-56 overflow-y-auto scrollbar-thin py-1">
                  <MultiSelectList options={COUNTRIES} selected={dataScope.countries} onChange={set('countries')} />
                </div>
              )}
            </div>

            {/* Health area */}
            <div className="relative">
              <HeroDropdown
                icon={Heart} label="Health area" placeholder="Any area"
                value={healthValue}
                onClick={() => healthDrop.setOpen((v) => !v)}
                onClear={() => set('healthAreas')([])}
              />
              {healthDrop.open && (
                <div ref={healthDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden w-full max-h-56 overflow-y-auto scrollbar-thin py-1">
                  <MultiSelectList options={HEALTH_AREAS} selected={dataScope.healthAreas} onChange={set('healthAreas')} />
                </div>
              )}
            </div>
          </div>

          {/* Segment */}
          <div className="mb-4">
            <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">
              Population or segment <span className="text-[#6B6B6B] font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#E0DDD7] hover:border-[#C8C4BC] rounded-xl transition-colors focus-within:border-[#C8A84B] focus-within:ring-2 focus-within:ring-[rgba(200,168,75,0.12)]">
              <Users size={15} className="text-[#6B6B6B] flex-shrink-0" />
              <input
                value={dataScope.segment}
                onChange={(e) => set('segment')(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleExplore(); }}
                placeholder="e.g. rural women 18–35, urban youth, adolescent girls…"
                className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none"
              />
              {dataScope.segment && (
                <button onClick={() => set('segment')('')} className="text-[#6B6B6B] hover:text-[#C0392B]"><X size={13} /></button>
              )}
            </div>
          </div>

          {/* Advanced data options */}
          <div className="mb-5">
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[#6B6B6B] text-xs hover:text-[#4A4A4A] transition-colors"
            >
              <SlidersHorizontal size={12} />
              Data options
              <ChevronDown size={11} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </button>
            {advancedOpen && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Source */}
                <div className="relative">
                  <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">Data source</label>
                  <button
                    onClick={() => sourceDrop.setOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#E0DDD7] hover:border-[#C8C4BC] rounded-lg text-xs text-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Database size={12} className="text-[#6B6B6B]" />
                      {currentSource.label}
                    </div>
                    <ChevronDown size={11} className="text-[#6B6B6B]" />
                  </button>
                  {sourceDrop.open && (
                    <div ref={sourceDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden w-full py-1">
                      <SingleSelectList options={DATA_SOURCES} selected={dataScope.dataSource} onChange={set('dataSource')} onClose={() => sourceDrop.setOpen(false)} />
                    </div>
                  )}
                </div>
                {/* Vintage */}
                <div className="relative">
                  <label className="block text-[#4A4A4A] text-xs font-medium mb-1.5">Data vintage</label>
                  <button
                    onClick={() => vintageDrop.setOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#E0DDD7] hover:border-[#C8C4BC] rounded-lg text-xs text-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#6B6B6B]" />
                      {currentVintage.label}
                    </div>
                    <ChevronDown size={11} className="text-[#6B6B6B]" />
                  </button>
                  {vintageDrop.open && (
                    <div ref={vintageDrop.ref} className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden w-full py-1">
                      <SingleSelectList options={VINTAGES} selected={dataScope.vintage} onChange={set('vintage')} onClose={() => vintageDrop.setOpen(false)} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Explore CTA */}
          <button
            onClick={handleExplore}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C8A84B] hover:bg-[#B89638] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Explore
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PromptBuilder({ onSend, variant = 'compact' }) {
  const { dataScope, setDataScope } = useConversation();

  if (variant === 'hero') {
    return <HeroForm dataScope={dataScope} setDataScope={setDataScope} onSend={onSend} />;
  }

  return <CompactBar dataScope={dataScope} setDataScope={setDataScope} onSend={onSend} />;
}
