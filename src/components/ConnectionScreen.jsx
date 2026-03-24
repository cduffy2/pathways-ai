import { useState } from 'react';
import { ChevronDown, ChevronUp, Plug, Loader2 } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { availableModels } from '../data/promptTemplates';

export default function ConnectionScreen() {
  const { mcpConnection, connectMCP } = useConversation();
  const [serverUrl, setServerUrl] = useState('http://localhost:3000/mcp');
  const [apiKey, setApiKey] = useState('');
  const [modelId, setModelId] = useState('gpt-5-2');
  const [mcpInfoOpen, setMcpInfoOpen] = useState(false);

  const isConnecting = mcpConnection.status === 'connecting';

  const handleConnect = (e) => {
    e.preventDefault();
    if (!serverUrl.trim()) return;
    connectMCP({ serverUrl: serverUrl.trim(), apiKey: apiKey.trim(), modelId });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#FAFAF8' }}
    >
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(200,168,75,0.15)', border: '1px solid rgba(200,168,75,0.3)' }}
          >
            <Plug size={15} style={{ color: '#C8A84B' }} />
          </div>
          <span className="text-sm font-semibold tracking-wide" style={{ color: '#1A1A1A' }}>
            Pathways AI
          </span>
        </div>
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#1A1A1A' }}>
          Connect your model
        </h1>
        <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: '#6B6B6B' }}>
          Pathways AI connects to your own language model via MCP.
          Enter your server URL and API key to get started.
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleConnect}
        className="w-full max-w-sm rounded-xl border p-6 shadow-sm"
        style={{ background: '#fff', borderColor: '#E0DDD7' }}
      >
        {/* Server URL */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#4A4A4A' }}>
            MCP Server URL
          </label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://localhost:3000/mcp"
            required
            disabled={isConnecting}
            className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
            style={{
              borderColor: '#E0DDD7',
              background: '#FAFAF8',
              color: '#1A1A1A',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
            onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
          />
        </div>

        {/* API Key */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#4A4A4A' }}>
            API Key{' '}
            <span className="font-normal" style={{ color: '#6B6B6B' }}>
              (optional)
            </span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            disabled={isConnecting}
            className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
            style={{
              borderColor: '#E0DDD7',
              background: '#FAFAF8',
              color: '#1A1A1A',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
            onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
          />
        </div>

        {/* Model */}
        <div className="mb-6">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#4A4A4A' }}>
            Model
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={isConnecting}
            className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50 bg-[#FAFAF8]"
            style={{ borderColor: '#E0DDD7', color: '#1A1A1A' }}
            onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
            onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Connect button */}
        <button
          type="submit"
          disabled={isConnecting || !serverUrl.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: isConnecting ? '#B89638' : '#C8A84B' }}
          onMouseEnter={(e) => { if (!isConnecting) e.target.style.background = '#B89638'; }}
          onMouseLeave={(e) => { if (!isConnecting) e.target.style.background = '#C8A84B'; }}
        >
          {isConnecting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Connecting…
            </>
          ) : (
            <>
              <Plug size={14} />
              Connect
            </>
          )}
        </button>
      </form>

      {/* What is MCP? */}
      <div
        className="w-full max-w-sm mt-3 rounded-xl border overflow-hidden"
        style={{ borderColor: '#E0DDD7' }}
      >
        <button
          type="button"
          onClick={() => setMcpInfoOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium transition-colors"
          style={{
            background: mcpInfoOpen ? '#F2F0EB' : '#fff',
            color: '#4A4A4A',
          }}
        >
          What is MCP?
          {mcpInfoOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {mcpInfoOpen && (
          <div
            className="px-4 pb-4 text-xs leading-relaxed"
            style={{ background: '#F2F0EB', color: '#6B6B6B' }}
          >
            MCP (Model Context Protocol) is an open standard that lets AI models connect to external
            tools and data sources. Pathways AI uses MCP to communicate with your chosen language
            model, keeping your data and API keys under your control — nothing is routed through
            Pathways servers.
          </div>
        )}
      </div>
    </div>
  );
}
