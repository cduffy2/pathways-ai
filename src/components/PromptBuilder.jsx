import { useState, useRef, useEffect } from 'react';
import { Globe, Heart, Users, Database, Calendar, X, ChevronDown, Check } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';

// ─── Data ───────────────────────────────────────────────────────────────────

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

// ─── Dropdown helpers ────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return { open, setOpen, ref };
}

function FilterPill({ icon: Icon, label, active, onClick, onClear, children }) {
  return (
    <div className="relative">
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
      {children}
    </div>
  );
}

function MultiSelect({ options, selected, onChange, dropState }) {
  const toggle = (val) =>
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);

  if (!dropState.open) return null;
  return (
    <div
      ref={dropState.ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[180px] max-h-64 overflow-y-auto scrollbar-thin"
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
        >
          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
            selected.includes(opt) ? 'bg-[#C8A84B] border-[#C8A84B]' : 'border-[#D8D5CF]'
          }`}>
            {selected.includes(opt) && <Check size={8} className="text-white" />}
          </div>
          <span className="text-[#1A1A1A]">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function SingleSelect({ options, selected, onChange, dropState }) {
  if (!dropState.open) return null;
  return (
    <div
      ref={dropState.ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0DDD7] rounded-xl shadow-xl overflow-hidden min-w-[150px]"
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => { onChange(opt.id); dropState.setOpen(false); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#F2F0EB] transition-colors"
        >
          <Check size={10} className={`flex-shrink-0 ${selected === opt.id ? 'text-[#C8A84B]' : 'opacity-0'}`} />
          <span className="text-[#1A1A1A]">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function PromptBuilder({ onSend }) {
  const { dataScope, setDataScope } = useConversation();
  const [focus, setFocus] = useState(''); // free-text segment/population focus

  const countryDrop = useDropdown();
  const healthDrop = useDropdown();
  const sourceDrop = useDropdown();
  const vintageDrop = useDropdown();

  const set = (key) => (val) => setDataScope((s) => ({ ...s, [key]: val }));

  const countryLabel = dataScope.countries.length === 0
    ? 'Country'
    : dataScope.countries.length === 1
      ? dataScope.countries[0]
      : `${dataScope.countries[0]} +${dataScope.countries.length - 1}`;

  const healthLabel = dataScope.healthAreas.length === 0
    ? 'Health area'
    : dataScope.healthAreas.length === 1
      ? dataScope.healthAreas[0]
      : `${dataScope.healthAreas[0]} +${dataScope.healthAreas.length - 1}`;

  const currentSource = DATA_SOURCES.find((s) => s.id === dataScope.dataSource) || DATA_SOURCES[0];
  const currentVintage = VINTAGES.find((v) => v.id === dataScope.vintage) || VINTAGES[0];

  const hasScope =
    dataScope.countries.length > 0 ||
    dataScope.healthAreas.length > 0 ||
    dataScope.dataSource !== 'all' ||
    dataScope.vintage !== 'latest';

  const clearAll = () => {
    setDataScope({ countries: [], healthAreas: [], dataSource: 'all', vintage: 'latest' });
    setFocus('');
  };

  // Build and send a structured prompt when the user hits Enter or the Send button
  const handleSend = () => {
    if (!focus.trim() && !hasScope) return;
    const parts = [];
    if (dataScope.countries.length > 0) parts.push(`Country: ${dataScope.countries.join(', ')}`);
    if (dataScope.healthAreas.length > 0) parts.push(`Health area: ${dataScope.healthAreas.join(', ')}`);
    if (focus.trim()) parts.push(`Population / segment: ${focus.trim()}`);
    if (dataScope.dataSource === 'pathways-only') parts.push('Use Pathways data only.');
    if (dataScope.vintage !== 'latest') parts.push(`Data vintage: ${dataScope.vintage}.`);
    const prompt = parts.length > 0
      ? `Please provide a deep dive analysis with the following scope:\n${parts.join('\n')}`
      : focus.trim();
    onSend(prompt);
    setFocus('');
  };

  return (
    <div className="border-b border-[#E0DDD7] bg-[#F8F6F1] px-4 py-2.5 flex-shrink-0">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Label */}
        <span className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold flex-shrink-0 mr-1">
          Scope
        </span>

        {/* Country */}
        <div className="relative">
          <FilterPill
            icon={Globe}
            label={countryLabel}
            active={dataScope.countries.length > 0}
            onClick={() => countryDrop.setOpen((v) => !v)}
            onClear={() => set('countries')([])}
          />
          <div ref={countryDrop.ref}>
            <MultiSelect
              options={COUNTRIES}
              selected={dataScope.countries}
              onChange={set('countries')}
              dropState={countryDrop}
            />
          </div>
        </div>

        {/* Health area */}
        <div className="relative">
          <FilterPill
            icon={Heart}
            label={healthLabel}
            active={dataScope.healthAreas.length > 0}
            onClick={() => healthDrop.setOpen((v) => !v)}
            onClear={() => set('healthAreas')([])}
          />
          <div ref={healthDrop.ref}>
            <MultiSelect
              options={HEALTH_AREAS}
              selected={dataScope.healthAreas}
              onChange={set('healthAreas')}
              dropState={healthDrop}
            />
          </div>
        </div>

        {/* Segment free text */}
        <div className="flex items-center gap-1 border border-[#D8D5CF] hover:border-[#B8B5AF] bg-transparent rounded-md px-2 py-1 transition-colors focus-within:border-[#C8A84B] focus-within:bg-white">
          <Users size={11} className="text-[#6B6B6B] flex-shrink-0" />
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Segment / population"
            className="bg-transparent text-[11px] text-[#1A1A1A] placeholder:text-[#6B6B6B] focus:outline-none w-36"
          />
          {focus && (
            <button onClick={() => setFocus('')} className="text-[#6B6B6B] hover:text-[#C0392B]">
              <X size={9} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-[#D8D5CF] mx-0.5" />

        {/* Data source */}
        <div className="relative">
          <FilterPill
            icon={Database}
            label={currentSource.label}
            active={dataScope.dataSource !== 'all'}
            onClick={() => sourceDrop.setOpen((v) => !v)}
            onClear={() => set('dataSource')('all')}
          />
          <div ref={sourceDrop.ref}>
            <SingleSelect
              options={DATA_SOURCES}
              selected={dataScope.dataSource}
              onChange={set('dataSource')}
              dropState={sourceDrop}
            />
          </div>
        </div>

        {/* Vintage */}
        <div className="relative">
          <FilterPill
            icon={Calendar}
            label={currentVintage.label}
            active={dataScope.vintage !== 'latest'}
            onClick={() => vintageDrop.setOpen((v) => !v)}
            onClear={() => set('vintage')('latest')}
          />
          <div ref={vintageDrop.ref}>
            <SingleSelect
              options={VINTAGES}
              selected={dataScope.vintage}
              onChange={set('vintage')}
              dropState={vintageDrop}
            />
          </div>
        </div>

        {/* Clear all */}
        {(hasScope || focus) && (
          <>
            <div className="w-px h-4 bg-[#D8D5CF] mx-0.5" />
            <button
              onClick={clearAll}
              className="text-[#6B6B6B] text-[10px] hover:text-[#C0392B] transition-colors"
            >
              Clear
            </button>
          </>
        )}

        {/* Send scoped query */}
        {(hasScope || focus) && (
          <button
            onClick={handleSend}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-[#C8A84B] hover:bg-[#B89638] text-white text-[11px] font-semibold rounded-md transition-colors flex-shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Ask
          </button>
        )}
      </div>
    </div>
  );
}
