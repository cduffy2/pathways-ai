import { useState } from 'react';
import { useConversation } from '../hooks/useConversation';
import ModelSelector from './ModelSelector';
import { BookOpen, PanelRight } from 'lucide-react';

export default function ConversationHeader({ onToggleUseCases, useCasesOpen, onOpenSourceDrawer }) {
  const { selectedModel, setSelectedModel, sourceDrawerOpen } = useConversation();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#E0DDD7] bg-white flex-shrink-0 gap-3">
      {/* App brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-md bg-[#C8A84B] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2C5.239 2 3 4.239 3 7c0 1.657.806 3.124 2.044 4.033L4.5 14h7l-.544-2.967C12.194 10.124 13 8.657 13 7c0-2.761-2.239-5-5-5z" fill="white" fillOpacity="0.9"/>
            <circle cx="8" cy="7" r="2" fill="#C8A84B"/>
          </svg>
        </div>
        <span className="text-[#1A1A1A] text-sm font-semibold tracking-tight">Pathways AI</span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Source drawer button (when conversation is active) */}
        {onOpenSourceDrawer && (
          <button
            onClick={onOpenSourceDrawer}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              sourceDrawerOpen
                ? 'bg-[rgba(42,157,143,0.1)] border-[rgba(42,157,143,0.3)] text-[#2A9D8F]'
                : 'border-transparent text-[#6B6B6B] hover:bg-[#F2F0EB] hover:text-[#1A1A1A]'
            }`}
          >
            <BookOpen size={13} />
            Sources
          </button>
        )}

        {/* Use cases panel toggle */}
        <button
          onClick={onToggleUseCases}
          title="Browse use cases"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            useCasesOpen
              ? 'bg-[rgba(200,168,75,0.12)] border-[rgba(200,168,75,0.3)] text-[#C8A84B]'
              : 'border-transparent text-[#6B6B6B] hover:bg-[#F2F0EB] hover:text-[#1A1A1A]'
          }`}
          aria-pressed={useCasesOpen}
        >
          <PanelRight size={13} />
          Use cases
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E0DDD7]" />

        {/* Model selector */}
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} compact />
      </div>
    </div>
  );
}
