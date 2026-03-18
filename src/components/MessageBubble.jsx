import { useState, useMemo } from 'react';
import { Copy, BookOpen, ThumbsUp, ThumbsDown, Check, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useConversation } from '../hooks/useConversation';

const FOLLOW_UP_PROMPTS = [
  'Narrow by geography — which country or region?',
  'Filter by health area or outcome',
  'Which indicator would you like to explore?',
];

// Parse [P1], [P2], [E1] etc. from text and replace with span markers
function CitedText({ text, citationMap, onCiteClick }) {
  if (!citationMap || !text) return <>{text}</>;

  const parts = [];
  const regex = /\[([PE]\d+)\]/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', content: text.slice(last, match.index) });
    }
    const key = match[1];
    const isPathways = key.startsWith('P');
    parts.push({ type: 'cite', key, isPathways });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: 'text', content: text.slice(last) });
  }

  return (
    <>
      {parts.map((part, i) =>
        part.type === 'text' ? (
          <span key={i}>{part.content}</span>
        ) : (
          <button
            key={i}
            onClick={() => onCiteClick && onCiteClick(part.key)}
            title={part.isPathways ? 'Pathways data source' : 'External source'}
            className={`inline-flex items-center text-[10px] font-semibold px-1 py-0.5 rounded ml-0.5 align-middle leading-none transition-opacity hover:opacity-75 ${
              part.isPathways
                ? 'bg-[rgba(42,157,143,0.15)] text-[#2A9D8F] border border-[rgba(42,157,143,0.3)]'
                : 'bg-[rgba(107,107,107,0.12)] text-[#6B6B6B] border border-[rgba(107,107,107,0.25)]'
            }`}
          >
            {part.key}
          </button>
        )
      )}
    </>
  );
}

// Custom markdown renderer that injects citation markers
function CitedMarkdown({ content, citationMap, onCiteClick }) {
  // Pre-process: wrap citation markers so they survive markdown parsing
  // We replace [P1] with a sentinel @@P1@@ to preserve through markdown,
  // then render the custom CitedText in the leaf text nodes.
  return (
    <div className="prose-pathways">
      <style>{`
        .prose-pathways h1, .prose-pathways h2, .prose-pathways h3 {
          color: #1A1A1A; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;
        }
        .prose-pathways h3 { font-size: 0.9rem; }
        .prose-pathways p { margin-bottom: 0.75rem; color: #1A1A1A; font-size: 0.875rem; line-height: 1.6; }
        .prose-pathways ul, .prose-pathways ol { margin: 0.5rem 0 0.75rem 1.25rem; }
        .prose-pathways li { margin-bottom: 0.35rem; color: #1A1A1A; font-size: 0.875rem; line-height: 1.6; }
        .prose-pathways strong { font-weight: 600; color: #1A1A1A; }
        .prose-pathways em { color: #4A4A4A; }
        .prose-pathways table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.8rem; }
        .prose-pathways th { background: #F2F0EB; padding: 0.5rem 0.75rem; text-align: left; border: 1px solid #E0DDD7; font-weight: 600; }
        .prose-pathways td { padding: 0.5rem 0.75rem; border: 1px solid #E0DDD7; }
        .prose-pathways code { background: #F2F0EB; padding: 0.1rem 0.35rem; border-radius: 3px; font-size: 0.8rem; color: #1A1A1A; }
        .prose-pathways blockquote { border-left: 3px solid #C8A84B; padding-left: 0.75rem; color: #4A4A4A; font-style: italic; margin: 0.75rem 0; }
        .prose-pathways a { color: #2A9D8F; text-decoration: underline; }
      `}</style>
      <ReactMarkdown
        components={{
          // Inject CitedText into paragraph and list item text nodes
          p: ({ children }) => (
            <p>
              {processChildren(children, citationMap, onCiteClick)}
            </p>
          ),
          li: ({ children }) => (
            <li>
              {processChildren(children, citationMap, onCiteClick)}
            </li>
          ),
          em: ({ children }) => (
            <em>
              {processChildren(children, citationMap, onCiteClick)}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function processChildren(children, citationMap, onCiteClick) {
  if (!citationMap) return children;
  return Array.isArray(children)
    ? children.map((child, i) =>
        typeof child === 'string'
          ? <CitedText key={i} text={child} citationMap={citationMap} onCiteClick={onCiteClick} />
          : child
      )
    : typeof children === 'string'
      ? <CitedText text={children} citationMap={citationMap} onCiteClick={onCiteClick} />
      : children;
}

const CONFIDENCE_CONFIG = {
  high:   { label: 'High confidence',   color: '#27AE60', bg: 'rgba(39,174,96,0.08)',   border: 'rgba(39,174,96,0.2)',   bars: 3 },
  medium: { label: 'Medium confidence', color: '#C8A84B', bg: 'rgba(200,168,75,0.08)', border: 'rgba(200,168,75,0.25)', bars: 2 },
  low:    { label: 'Low confidence',    color: '#C0392B', bg: 'rgba(192,57,43,0.08)',  border: 'rgba(192,57,43,0.2)',  bars: 1 },
};

function ConfidenceBadge({ level }) {
  const cfg = CONFIDENCE_CONFIG[level] || CONFIDENCE_CONFIG.high;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
      title={cfg.label}
    >
      <span className="flex items-end gap-0.5 h-3">
        {[1, 2, 3].map((b) => (
          <span
            key={b}
            className="w-0.5 rounded-[1px]"
            style={{
              height: `${b * 33}%`,
              background: b <= cfg.bars ? cfg.color : 'rgba(0,0,0,0.12)',
              display: 'inline-block',
            }}
          />
        ))}
      </span>
      {cfg.label}
    </span>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#C8A84B] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
          />
        ))}
      </div>
      <span className="text-[#6B6B6B] text-xs">Thinking…</span>
    </div>
  );
}

export default function MessageBubble({ message, isLastAssistantMessage, showFollowUps }) {
  const { openSourceDrawer, retryLastMessage } = useConversation();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCiteClick = (key) => {
    if (message.sourceData) openSourceDrawer(message.sourceData);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div
          className="max-w-[70%] px-4 py-3 bg-[#1A1A1A] text-white text-sm rounded-2xl rounded-tr-sm leading-relaxed"
          style={{ wordBreak: 'break-word' }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex flex-col items-start mb-6">
      <div className="max-w-[88%] w-full">
        {message.error ? (
          <div className="flex items-start gap-3 px-4 py-3 bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-xl text-sm text-[#C0392B]">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-1">Something went wrong</p>
              <p className="text-xs text-[#4A4A4A] mb-2">The request failed. Check your connection and try again.</p>
              <button
                onClick={retryLastMessage}
                className="flex items-center gap-1.5 text-xs text-[#C0392B] hover:text-[#A0291E] font-medium"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        ) : message.isStreaming && !message.content ? (
          <ThinkingIndicator />
        ) : (
          <div>
            <CitedMarkdown
              content={message.content}
              citationMap={message.sourceData?.citationMap}
              onCiteClick={handleCiteClick}
            />
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-[#C8A84B] ml-0.5 animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* Message toolbar + confidence badge */}
      {!message.isStreaming && !message.error && message.content && (
        <div className="flex items-center gap-2 mt-2 ml-0.5 flex-wrap">
          {/* Confidence badge */}
          {message.sourceData?.confidence && (
            <ConfidenceBadge level={message.sourceData.confidence.level} />
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              title="Copy"
              className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB] rounded-md transition-colors"
            >
              {copied ? <Check size={13} className="text-[#27AE60]" /> : <Copy size={13} />}
            </button>

            {message.sourceData && (
              <button
                onClick={() => openSourceDrawer(message.sourceData)}
                title="View sources"
                className="flex items-center gap-1.5 px-2 py-1.5 text-[#2A9D8F] hover:bg-[rgba(42,157,143,0.1)] rounded-md text-[11px] font-medium transition-colors"
              >
                <BookOpen size={13} />
                View sources
              </button>
            )}

            <div className="flex items-center gap-0.5 border-l border-[#E0DDD7] pl-2 ml-1">
              <button
                onClick={() => setFeedback('up')}
                title="Helpful"
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'up'
                    ? 'text-[#27AE60] bg-[rgba(39,174,96,0.1)]'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB]'
                }`}
              >
                <ThumbsUp size={12} />
              </button>
              <button
                onClick={() => setFeedback('down')}
                title="Not helpful"
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'down'
                    ? 'text-[#C0392B] bg-[rgba(192,57,43,0.1)]'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB]'
                }`}
              >
                <ThumbsDown size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Source legend — only once per response that has citations */}
      {!message.isStreaming && message.sourceData?.references?.length > 0 && (
        <div className="flex items-center gap-3 mt-2 ml-0.5">
          <span className="flex items-center gap-1 text-[10px] text-[#2A9D8F]">
            <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold bg-[rgba(42,157,143,0.15)] border border-[rgba(42,157,143,0.3)]">P</span>
            Pathways data
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[#6B6B6B]">
            <span className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold bg-[rgba(107,107,107,0.12)] border border-[rgba(107,107,107,0.25)]">E</span>
            External source
          </span>
        </div>
      )}

      {/* Follow-up prompts */}
      {showFollowUps && !message.isStreaming && message.content && (
        <div className="mt-3 flex flex-wrap gap-2">
          {FOLLOW_UP_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                const ev = new CustomEvent('pathways:followup', { detail: prompt });
                window.dispatchEvent(ev);
              }}
              className="px-3 py-1.5 border border-[#E0DDD7] hover:border-[#C8A84B] bg-white hover:bg-[rgba(200,168,75,0.04)] text-[#4A4A4A] text-xs rounded-full transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
