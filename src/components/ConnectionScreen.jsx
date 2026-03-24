import { useState } from 'react';
import { Plug, Loader2 } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { availableModels } from '../data/promptTemplates';

const FIXED_SERVER_URL = 'http://localhost:3000/mcp';

export default function ConnectionScreen() {
  const { mcpConnection, connectMCP } = useConversation();
  const [apiKey, setApiKey] = useState('');
  const [modelId, setModelId] = useState('gpt-5-2');

  const isConnecting = mcpConnection.status === 'connecting';

  const handleConnect = (e) => {
    e.preventDefault();
    connectMCP({ serverUrl: FIXED_SERVER_URL, apiKey: apiKey.trim(), modelId });
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
          Choose your language model and enter your API key to start exploring Pathways data.
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleConnect}
        className="w-full max-w-sm rounded-xl border p-6 shadow-sm"
        style={{ background: '#fff', borderColor: '#E0DDD7' }}
      >
        {/* Model */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#4A4A4A' }}>
            Model
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={isConnecting}
            className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
            style={{ borderColor: '#E0DDD7', background: '#FAFAF8', color: '#1A1A1A' }}
            onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
            onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px]" style={{ color: '#6B6B6B' }}>
            {availableModels.find((m) => m.id === modelId)?.description}
          </p>
        </div>

        {/* API Key */}
        <div className="mb-6">
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#4A4A4A' }}>
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            disabled={isConnecting}
            className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
            style={{ borderColor: '#E0DDD7', background: '#FAFAF8', color: '#1A1A1A' }}
            onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
            onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
          />
        </div>

        {/* Connect button */}
        <button
          type="submit"
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#C8A84B' }}
          onMouseEnter={(e) => { if (!isConnecting) e.target.style.background = '#B89638'; }}
          onMouseLeave={(e) => { e.target.style.background = '#C8A84B'; }}
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
    </div>
  );
}
