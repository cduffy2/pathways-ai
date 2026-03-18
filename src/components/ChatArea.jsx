import { useRef, useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import OnboardingState from './OnboardingState';
import MessageBubble from './MessageBubble';
import PromptBuilder from './PromptBuilder';
import ChatInput from './ChatInput';

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

  const messagesEndRef = useRef(null);

  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isStreaming]);

  // Follow-up event
  const handleSend = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;
    await sendMessage(trimmed);
  }, [sendMessage]);

  useEffect(() => {
    const handler = (e) => handleSend(e.detail);
    window.addEventListener('pathways:followup', handler);
    return () => window.removeEventListener('pathways:followup', handler);
  }, [handleSend]);

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

      {/* Compact scope bar — only once conversation is active */}
      {hasMessages && <PromptBuilder onSend={handleSend} />}

      {/* Main area */}
      {!hasMessages ? (
        <OnboardingState onChipClick={handleSend} onSend={handleSend} />
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
        </>
      )}

      {/* Shared input — always at bottom */}
      <div className="border-t border-[#E0DDD7] bg-white px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
