import { useState } from 'react';
import { ChevronDown, ChevronRight, Wifi, WifiOff, Wrench } from 'lucide-react';

export default function MCPStatus({ connected, tools, serverUrl, error }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-3 py-3 border-t border-[#E0DDD7]">
      {/* Status row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 text-left group"
        aria-expanded={expanded}
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            connected ? 'bg-[#27AE60]' : 'bg-[#C0392B]'
          }`}
          style={{
            boxShadow: connected
              ? '0 0 4px rgba(39,174,96,0.6)'
              : '0 0 4px rgba(192,57,43,0.6)',
          }}
        />
        <div className="flex-1 min-w-0">
          <span className="text-[#1A1A1A] text-xs font-medium leading-none">
            {connected
              ? `MCP connected — ${tools.length} tool${tools.length !== 1 ? 's' : ''}`
              : 'MCP disconnected'}
          </span>
          {error && (
            <p className="text-[#C0392B] text-[10px] mt-0.5 truncate">{error}</p>
          )}
        </div>
        <span className="text-[#6B6B6B] flex-shrink-0">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>

      {/* Server URL */}
      <p className="text-[#6B6B6B] text-[10px] mt-1 ml-4 truncate">{serverUrl}</p>

      {/* Tools list */}
      {expanded && tools.length > 0 && (
        <div className="mt-2 ml-4 space-y-1">
          <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-medium mb-1.5">
            Available tools
          </p>
          {tools.map((tool) => (
            <div key={tool.name} className="flex items-start gap-1.5">
              <Wrench size={10} className="text-[#C8A84B] mt-0.5 flex-shrink-0" />
              <span className="text-[#4A4A4A] text-[11px] font-mono leading-tight">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
