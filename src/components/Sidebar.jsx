import { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, MoreHorizontal, Unplug } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { availableModels } from '../data/promptTemplates';

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
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed) onRename(conv.id, trimmed);
    setRenaming(false);
  };

  const timeLabel = new Date(conv.updatedAt).toLocaleDateString('en-GB', {
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

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    mcpConnection,
    disconnectMCP,
  } = useConversation();

  const connectedModel = availableModels.find((m) => m.id === mcpConnection.modelId);

  const handleDisconnect = () => {
    const hasConversations = conversations.length > 0;
    if (hasConversations) {
      if (!window.confirm('Disconnecting will clear all conversations. Continue?')) return;
    }
    disconnectMCP();
  };

  return (
    <aside
      className="flex flex-col h-full bg-[#F2F0EB] border-r border-[#E0DDD7]"
      style={{ width: 240, minWidth: 240, maxWidth: 240 }}
    >
      {/* New conversation */}
      <div className="px-3 pt-4 pb-3 border-b border-[#E0DDD7]">
        <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold mb-2.5 px-1">
          Conversations
        </p>
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
          <p className="text-[#6B6B6B] text-[11px] text-center py-8 px-3 leading-relaxed">
            No conversations yet. Use the prompt builder above to get started.
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

      {/* Footer: connected model + disconnect */}
      <div className="px-3 py-3 border-t border-[#E0DDD7]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#27AE60] flex-shrink-0" />
          <p className="text-[10px] text-[#6B6B6B] truncate flex-1">
            {connectedModel ? connectedModel.label : mcpConnection.modelId}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-[#6B6B6B] hover:text-[#C0392B] hover:bg-[#F2F0EB] transition-colors"
        >
          <Unplug size={11} />
          Disconnect
        </button>
      </div>

    </aside>
  );
}
