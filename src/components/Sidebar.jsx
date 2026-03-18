import { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import MCPStatus from './MCPStatus';
import ModelSelector from './ModelSelector';
import PromptTemplate from './PromptTemplate';
import { promptTemplates } from '../data/promptTemplates';
import { useMCP } from '../hooks/useMCP';

function ConversationItem({ conv, isActive, onSelect, onDelete, onRename }) {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conv.title);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed) onRename(conv.id, trimmed);
    setRenaming(false);
  };

  const date = new Date(conv.updatedAt);
  const timeLabel = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-[rgba(200,168,75,0.12)] border border-[rgba(200,168,75,0.3)]'
          : 'hover:bg-[#F2F0EB]'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      onClick={() => !renaming && onSelect(conv.id)}
    >
      <MessageSquare
        size={13}
        className={`flex-shrink-0 ${isActive ? 'text-[#C8A84B]' : 'text-[#6B6B6B]'}`}
      />
      <div className="flex-1 min-w-0">
        {renaming ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') setRenaming(false);
              }}
              className="flex-1 text-xs bg-white border border-[#C8A84B] rounded px-1.5 py-0.5 text-[#1A1A1A] focus:outline-none"
            />
            <button onClick={handleRenameSubmit} className="text-[#27AE60]"><Check size={11} /></button>
            <button onClick={() => setRenaming(false)} className="text-[#6B6B6B]"><X size={11} /></button>
          </div>
        ) : (
          <>
            <p className={`text-xs truncate leading-none mb-0.5 ${isActive ? 'text-[#1A1A1A] font-medium' : 'text-[#1A1A1A]'}`}>
              {conv.title}
            </p>
            <p className="text-[10px] text-[#6B6B6B]">{timeLabel}</p>
          </>
        )}
      </div>

      {(hovered || menuOpen) && !renaming && (
        <div className="relative flex-shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-0.5 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-[#E0DDD7] rounded-lg shadow-lg overflow-hidden min-w-[120px]">
              <button
                onClick={() => { setRenaming(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1A1A1A] hover:bg-[#F2F0EB] text-left"
              >
                <Edit2 size={11} /> Rename
              </button>
              <button
                onClick={() => { onDelete(conv.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#C0392B] hover:bg-[#F2F0EB] text-left"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onSendPrompt }) {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    selectedModel,
    setSelectedModel,
  } = useConversation();

  const mcp = useMCP();
  const [promptsOpen, setPromptsOpen] = useState(true);

  return (
    <aside
      className="flex flex-col h-full bg-[#F2F0EB] border-r border-[#E0DDD7]"
      style={{ width: 260, minWidth: 260, maxWidth: 260 }}
    >
      {/* App identity */}
      <div className="px-4 py-4 border-b border-[#E0DDD7]">
        <div className="flex items-center gap-2.5 mb-0.5">
          {/* Icon */}
          <div className="w-7 h-7 rounded-lg bg-[#C8A84B] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2C5.239 2 3 4.239 3 7c0 1.657.806 3.124 2.044 4.033L4.5 14h7l-.544-2.967C12.194 10.124 13 8.657 13 7c0-2.761-2.239-5-5-5z" fill="white" fillOpacity="0.9"/>
              <circle cx="8" cy="7" r="2" fill="#C8A84B"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[#1A1A1A] text-sm font-semibold leading-none tracking-tight">
              Pathways AI
            </h1>
            <p className="text-[#6B6B6B] text-[10px] mt-0.5 leading-none">
              Health segmentation assistant
            </p>
          </div>
        </div>
      </div>

      {/* Model selector */}
      <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />

      {/* New conversation */}
      <div className="px-3 py-3 border-b border-[#E0DDD7]">
        <button
          onClick={createConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#C8A84B] hover:bg-[#B89638] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} />
          New conversation
        </button>
      </div>

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-0.5">
        {conversations.length === 0 ? (
          <p className="text-[#6B6B6B] text-[11px] text-center py-6 px-2">
            No conversations yet.
            <br />Start by asking a question.
          </p>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeConversationId}
              onSelect={setActiveConversationId}
              onDelete={deleteConversation}
              onRename={renameConversation}
            />
          ))
        )}
      </div>

      {/* Prompts panel */}
      <div className="border-t border-[#E0DDD7]">
        <button
          onClick={() => setPromptsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#E8E5DE] transition-colors"
          aria-expanded={promptsOpen}
        >
          <span className="text-[#4A4A4A] text-[10px] uppercase tracking-wider font-semibold">
            Prompts
          </span>
          <ChevronDown
            size={12}
            className={`text-[#6B6B6B] transition-transform ${promptsOpen ? '' : '-rotate-90'}`}
          />
        </button>
        {promptsOpen && (
          <div className="px-3 pb-3 space-y-2">
            {promptTemplates.map((template) => (
              <PromptTemplate
                key={template.id}
                template={template}
                onSend={onSendPrompt}
              />
            ))}
          </div>
        )}
      </div>

      {/* MCP status */}
      <MCPStatus
        connected={mcp.connected}
        tools={mcp.tools}
        serverUrl={mcp.serverUrl}
        error={mcp.error}
      />
    </aside>
  );
}
