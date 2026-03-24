import { useState } from 'react';
import { Plug, Loader2, ChevronRight, Check } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { llmProviders } from '../data/promptTemplates';

const FIXED_SERVER_URL = 'http://localhost:3000/mcp';

export default function ConnectionScreen() {
  const { mcpConnection, connectMCP } = useConversation();
  const [providerId, setProviderId] = useState(null);
  const [modelId, setModelId] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const isConnecting = mcpConnection.status === 'connecting';
  const provider = llmProviders.find((p) => p.id === providerId);

  const handleSelectProvider = (id) => {
    setProviderId(id);
    const p = llmProviders.find((pr) => pr.id === id);
    setModelId(p.models.find((m) => m.isDefault)?.id ?? p.models[0].id);
    setApiKey('');
  };

  const handleConnect = (e) => {
    e.preventDefault();
    connectMCP({ serverUrl: FIXED_SERVER_URL, apiKey: apiKey.trim(), modelId, providerId });
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
          Choose your AI provider to start exploring Pathways data.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">

        {/* Step 1 — Provider */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: '#fff', borderColor: '#E0DDD7' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#E0DDD7' }}>
            <p className="text-xs font-semibold" style={{ color: '#4A4A4A' }}>
              1 — Choose provider
            </p>
          </div>
          <div className="p-2 space-y-1">
            {llmProviders.map((p) => {
              const selected = providerId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProvider(p.id)}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left disabled:opacity-50"
                  style={{
                    background: selected ? 'rgba(200,168,75,0.1)' : 'transparent',
                    border: `1px solid ${selected ? 'rgba(200,168,75,0.4)' : 'transparent'}`,
                    color: selected ? '#1A1A1A' : '#4A4A4A',
                    fontWeight: selected ? 500 : 400,
                  }}
                >
                  {p.label}
                  {selected
                    ? <Check size={13} style={{ color: '#C8A84B', flexShrink: 0 }} />
                    : <ChevronRight size={13} style={{ color: '#C8C4BC', flexShrink: 0 }} />
                  }
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — Model (only when provider selected) */}
        {provider && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: '#fff', borderColor: '#E0DDD7' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#E0DDD7' }}>
              <p className="text-xs font-semibold" style={{ color: '#4A4A4A' }}>
                2 — Choose model
              </p>
            </div>
            <div className="p-2 space-y-1">
              {provider.models.map((m) => {
                const selected = modelId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModelId(m.id)}
                    disabled={isConnecting}
                    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors disabled:opacity-50"
                    style={{
                      background: selected ? 'rgba(200,168,75,0.1)' : 'transparent',
                      border: `1px solid ${selected ? 'rgba(200,168,75,0.4)' : 'transparent'}`,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm leading-none mb-1"
                        style={{ color: '#1A1A1A', fontWeight: selected ? 500 : 400 }}
                      >
                        {m.label}
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: '#6B6B6B' }}>
                        {m.description}
                      </p>
                    </div>
                    {selected && <Check size={13} style={{ color: '#C8A84B', flexShrink: 0, marginTop: 2 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — API key + connect (only when model selected) */}
        {provider && modelId && (
          <form
            onSubmit={handleConnect}
            className="rounded-xl border overflow-hidden"
            style={{ background: '#fff', borderColor: '#E0DDD7' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#E0DDD7' }}>
              <p className="text-xs font-semibold" style={{ color: '#4A4A4A' }}>
                3 — Add API key
              </p>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider.keyPlaceholder}
                disabled={isConnecting}
                className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors disabled:opacity-50"
                style={{ borderColor: '#E0DDD7', background: '#FAFAF8', color: '#1A1A1A' }}
                onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
                onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
              />
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
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
