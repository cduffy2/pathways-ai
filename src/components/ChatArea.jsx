import { useState, useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import OnboardingState from './OnboardingState';
import MessageBubble from './MessageBubble';
import PromptBuilder from './PromptBuilder';

function WorkflowBanner({ onDismiss }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(200,168,75,0.1)] border-b border-[rgba(200,168,75,0.2)] text-[#4A4A4A] text-xs">
      <AlertTriangle size={13} className="text-[#C8A84B] flex-shrink-0" />
      <span className="flex-1">
        Managing workflow — focusing on sourcing data to meet with realities of a project in flight.
      </span>
      <button onClick={onDismiss} className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
        <X size={13} />
      </button>
    </div>
  );
}

export default function ChatArea() {
  const {
    activeConversation,
    isStreaming,
    error,
    sendMessage,
    workflowBannerVisible,
    dismissWorkflowBanner,
  } = useConversation();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isStreaming]);

  // Follow-up event
  useEffect(() => {
    const handler = (e) => handleSend(e.detail);
    window.addEventListener('pathways:followup', handler);
    return () => window.removeEventListener('pathways:followup', handler);
  }, []);

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || inputValue).trim();
    if (!trimmed) return;
    setInputValue('');
    await sendMessage(trimmed);
  }, [inputValue, sendMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const lastAssistantIdx = messages.reduceRight(
    (acc, m, i) => (acc === -1 && m.role === 'assistant' ? i : acc),
    -1
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFAF8]">
      {/* Workflow banner */}
      {workflowBannerVisible && hasMessages && (
        <WorkflowBanner onDismiss={dismissWorkflowBanner} />
      )}

      {/* Prompt builder — always visible */}
      <PromptBuilder onSend={handleSend} />

      {/* Main area */}
      {!hasMessages ? (
        <OnboardingState
          onChipClick={(chip) => handleSend(chip)}
          onInputChange={setInputValue}
          onSubmit={() => handleSend()}
          inputValue={inputValue}
        />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastAssistantMessage={idx === lastAssistantIdx}
                  showFollowUps={
                    idx === lastAssistantIdx &&
                    !isStreaming &&
                    messages.filter((m) => m.role === 'assistant').length === 1
                  }
                />
              ))}
              {error && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] rounded-lg text-xs text-[#C0392B] mb-4">
                  <AlertTriangle size={13} />
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-[#E0DDD7] bg-white px-4 py-3 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2 bg-[#FAFAF8] border border-[#E0DDD7] rounded-xl px-3 py-2 focus-within:border-[#C8A84B] focus-within:ring-2 focus-within:ring-[rgba(200,168,75,0.15)] transition-all">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about Pathways health data…"
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 bg-transparent text-[#1A1A1A] text-sm placeholder:text-[#6B6B6B] resize-none focus:outline-none leading-relaxed disabled:opacity-50 overflow-hidden"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isStreaming}
                  className="self-end p-2 bg-[#C8A84B] hover:bg-[#B89638] disabled:bg-[#E0DDD7] text-white rounded-lg transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
