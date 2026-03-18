import { useState } from 'react';
import { Copy, BookOpen, ThumbsUp, ThumbsDown, Check, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useConversation } from '../hooks/useConversation';

const FOLLOW_UP_PROMPTS = [
  'Narrow by geography — which country or region?',
  'Filter by health area or outcome',
  'Which indicator would you like to explore?',
];

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
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
      {/* Bubble */}
      <div className="max-w-[85%] w-full">
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
          <div className="prose prose-sm max-w-none text-[#1A1A1A] leading-relaxed">
            <style>{`
              .prose h1, .prose h2, .prose h3 {
                color: #1A1A1A;
                font-weight: 600;
                margin-top: 1rem;
                margin-bottom: 0.5rem;
              }
              .prose h3 { font-size: 0.95rem; }
              .prose p { margin-bottom: 0.75rem; color: #1A1A1A; }
              .prose ul, .prose ol { margin: 0.5rem 0 0.75rem 1.25rem; }
              .prose li { margin-bottom: 0.25rem; color: #1A1A1A; }
              .prose strong { font-weight: 600; color: #1A1A1A; }
              .prose em { color: #4A4A4A; }
              .prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.8rem; }
              .prose th { background: #F2F0EB; padding: 0.5rem 0.75rem; text-align: left; border: 1px solid #E0DDD7; font-weight: 600; }
              .prose td { padding: 0.5rem 0.75rem; border: 1px solid #E0DDD7; }
              .prose code { background: #F2F0EB; padding: 0.1rem 0.35rem; border-radius: 3px; font-size: 0.8rem; color: #1A1A1A; }
              .prose blockquote { border-left: 3px solid #C8A84B; padding-left: 0.75rem; color: #4A4A4A; font-style: italic; margin: 0.75rem 0; }
            `}</style>
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-[#C8A84B] ml-0.5 animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* Message toolbar */}
      {!message.isStreaming && !message.error && message.content && (
        <div className="flex items-center gap-1 mt-2 ml-0.5">
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

          <div className="flex items-center gap-0.5 ml-1 border-l border-[#E0DDD7] pl-2">
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
