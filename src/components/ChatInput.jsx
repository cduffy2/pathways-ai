import { useState, useRef, useEffect, useCallback } from 'react';
import { Wrench } from 'lucide-react';
import SlashCommandPicker from './SlashCommandPicker';
import { useMCP } from '../hooks/useMCP';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const textareaRef = useRef(null);
  const wrapperRef = useRef(null);
  const { connected, tools } = useMCP();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [value]);

  // Parse slash command from current value
  useEffect(() => {
    // Show picker when value starts with '/'
    const match = value.match(/^\/(\S*)$/);
    if (match) {
      setSlashQuery(match[1]);
      setPickerOpen(true);
      setActiveIndex(0);
    } else if (value.startsWith('/') && value.includes(' ')) {
      // Already selected a command — keep picker closed
      setPickerOpen(false);
    } else {
      setPickerOpen(false);
    }
  }, [value]);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const filteredTools = tools.filter(
    (t) =>
      slashQuery === '' ||
      t.name.toLowerCase().includes(slashQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(slashQuery.toLowerCase())
  );

  const selectTool = useCallback((tool) => {
    setValue(`/${tool.name} `);
    setPickerOpen(false);
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (pickerOpen && filteredTools.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredTools.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectTool(filteredTools[activeIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setPickerOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey && !pickerOpen) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue('');
    setPickerOpen(false);
    onSend(trimmed);
  };

  const openPickerManually = () => {
    setValue('/');
    setPickerOpen(true);
    setSlashQuery('');
    setActiveIndex(0);
    textareaRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Slash command picker */}
      {pickerOpen && connected && (
        <SlashCommandPicker
          tools={tools}
          query={slashQuery}
          activeIndex={activeIndex}
          onSelect={selectTool}
          onActiveChange={setActiveIndex}
        />
      )}

      {/* Input card */}
      <div className="bg-[#FAFAF8] border border-[#E0DDD7] rounded-xl focus-within:border-[#C8A84B] focus-within:ring-2 focus-within:ring-[rgba(200,168,75,0.15)] transition-all overflow-hidden">
        {/* Textarea */}
        <div className="px-3 pt-2.5">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Pathways health data… or type / for tools"
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] resize-none focus:outline-none leading-relaxed disabled:opacity-50 overflow-hidden"
            style={{ minHeight: '24px', maxHeight: '120px' }}
            aria-label="Message input"
            aria-autocomplete="list"
            aria-expanded={pickerOpen}
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5">
          {/* Left: MCP tools trigger + status */}
          <div className="flex items-center gap-2">
            <button
              onClick={openPickerManually}
              disabled={!connected}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                connected
                  ? 'text-[#6B6B6B] hover:bg-[#EEECE6] hover:text-[#1A1A1A]'
                  : 'text-[#B0ADA8] cursor-not-allowed'
              }`}
              title={connected ? 'Browse MCP tools (or type /)' : 'MCP server not connected'}
              aria-label="Open tool picker"
            >
              <Wrench size={12} className={connected ? 'text-[#C8A84B]' : 'text-[#B0ADA8]'} />
              <span className="font-mono">/</span>
              {connected ? (
                <span>{tools.length} tool{tools.length !== 1 ? 's' : ''}</span>
              ) : (
                <span>tools</span>
              )}
            </button>

            {/* Connection dot */}
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#27AE60]' : 'bg-[#C0392B]'}`}
                style={{
                  boxShadow: connected
                    ? '0 0 4px rgba(39,174,96,0.5)'
                    : '0 0 3px rgba(192,57,43,0.5)',
                }}
              />
              <span className="text-[#6B6B6B] text-[10px]">
                {connected ? 'MCP' : 'disconnected'}
              </span>
            </div>
          </div>

          {/* Right: Send button */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="flex items-center justify-center w-7 h-7 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] text-white rounded-lg transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
