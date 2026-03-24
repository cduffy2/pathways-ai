import { useState } from 'react';
import { Plug, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { llmProviders } from '../data/promptTemplates';

const FIXED_SERVER_URL = 'http://localhost:3000/mcp';

function Brand() {
  return (
    <div className="inline-flex items-center gap-2 mb-10">
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
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs mt-3 mb-8 transition-colors"
      style={{ color: '#6B6B6B' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1A1A')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6B6B')}
    >
      <ChevronLeft size={13} />
      Back
    </button>
  );
}

// Step 1 — pick provider
function StepProvider({ onSelect }) {
  return (
    <div className="w-full max-w-sm">
      <Brand />
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1A1A1A' }}>
        Choose your provider
      </h1>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: '#6B6B6B' }}>
        Select the AI provider you have an account with.
      </p>
      <div className="space-y-2">
        {llmProviders.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-colors"
            style={{ background: '#fff', borderColor: '#E0DDD7', color: '#1A1A1A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)';
              e.currentTarget.style.background = 'rgba(200,168,75,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E0DDD7';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <span className="font-medium">{p.label}</span>
            <ChevronRight size={14} style={{ color: '#C8C4BC', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2 — pick model
function StepModel({ provider, selectedModelId, onSelect, onBack }) {
  return (
    <div className="w-full max-w-sm">
      <Brand />
      <BackButton onClick={onBack} />
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1A1A1A' }}>
        Choose a model
      </h1>

      <p className="text-sm mb-6 leading-relaxed" style={{ color: '#6B6B6B' }}>
        {provider.label} — select the model you'd like to use.
      </p>
      <div className="space-y-2">
        {provider.models.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className="w-full flex items-start justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-colors"
            style={{ background: '#fff', borderColor: '#E0DDD7' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,168,75,0.4)';
              e.currentTarget.style.background = 'rgba(200,168,75,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E0DDD7';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium mb-0.5" style={{ color: '#1A1A1A' }}>
                {m.label}
                {m.isDefault && (
                  <span
                    className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(200,168,75,0.15)', color: '#C8A84B' }}
                  >
                    Recommended
                  </span>
                )}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#6B6B6B' }}>
                {m.description}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: '#C8C4BC', flexShrink: 0, marginTop: 2 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3 — API key
function StepApiKey({ provider, modelId, onBack, onConnect, isConnecting }) {
  const [apiKey, setApiKey] = useState('');
  const model = provider.models.find((m) => m.id === modelId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(apiKey.trim());
  };

  return (
    <div className="w-full max-w-sm">
      <Brand />
      <BackButton onClick={onBack} />
      <h1 className="text-xl font-semibold mb-1" style={{ color: '#1A1A1A' }}>
        Add your API key
      </h1>

      <p className="text-sm mb-6 leading-relaxed" style={{ color: '#6B6B6B' }}>
        {provider.label} · {model?.label}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={provider.keyPlaceholder}
          disabled={isConnecting}
          autoFocus
          className="w-full text-sm px-3 py-2.5 rounded-xl border focus:outline-none transition-colors disabled:opacity-50"
          style={{ borderColor: '#E0DDD7', background: '#fff', color: '#1A1A1A' }}
          onFocus={(e) => (e.target.style.borderColor = '#C8A84B')}
          onBlur={(e) => (e.target.style.borderColor = '#E0DDD7')}
        />
        <button
          type="submit"
          disabled={isConnecting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#C8A84B' }}
          onMouseEnter={(e) => { if (!isConnecting) e.currentTarget.style.background = '#B89638'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#C8A84B'; }}
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

export default function ConnectionScreen() {
  const { mcpConnection, connectMCP } = useConversation();
  const [step, setStep] = useState(1);
  const [providerId, setProviderId] = useState(null);
  const [modelId, setModelId] = useState(null);

  const isConnecting = mcpConnection.status === 'connecting';
  const provider = llmProviders.find((p) => p.id === providerId);

  const handleSelectProvider = (id) => {
    setProviderId(id);
    setStep(2);
  };

  const handleSelectModel = (id) => {
    setModelId(id);
    setStep(3);
  };

  const handleConnect = (apiKey) => {
    connectMCP({ serverUrl: FIXED_SERVER_URL, apiKey, modelId, providerId });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#FAFAF8' }}
    >
      {step === 1 && (
        <StepProvider onSelect={handleSelectProvider} />
      )}
      {step === 2 && provider && (
        <StepModel
          provider={provider}
          selectedModelId={modelId}
          onSelect={handleSelectModel}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && provider && modelId && (
        <StepApiKey
          provider={provider}
          modelId={modelId}
          onBack={() => setStep(2)}
          onConnect={handleConnect}
          isConnecting={isConnecting}
        />
      )}
    </div>
  );
}
