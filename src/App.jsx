import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ConversationProvider } from './context/ConversationContext';
import { useConversation } from './hooks/useConversation';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SourceDrawer from './components/SourceDrawer';
import ConversationHeader from './components/ConversationHeader';
import UseCasePanel from './components/UseCasePanel';

function AppShell() {
  const { openSourceDrawer, activeSourceData, sendMessage } = useConversation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);

  const handleOpenSourceDrawer = () => {
    if (activeSourceData) openSourceDrawer(activeSourceData);
  };

  return (
    <div className="flex h-full overflow-hidden relative" style={{ background: '#FAFAF8' }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="fixed top-3 left-3 z-40 md:hidden p-2 bg-white border border-[#E0DDD7] rounded-lg shadow-sm"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Left sidebar — conversations only */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-30 flex-shrink-0 transition-transform duration-300 md:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ height: '100%' }}
      >
        <Sidebar />
      </div>

      {/* Main column */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header: brand + model selector + use cases toggle */}
        <ConversationHeader
          onToggleUseCases={() => setUseCasesOpen((v) => !v)}
          useCasesOpen={useCasesOpen}
          onOpenSourceDrawer={activeSourceData ? handleOpenSourceDrawer : null}
        />

        {/* Body row: chat + optional right panel */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ChatArea />

          {/* Use cases right panel */}
          <UseCasePanel
            open={useCasesOpen}
            onClose={() => setUseCasesOpen(false)}
            onSend={(prompt) => { sendMessage(prompt); setUseCasesOpen(false); }}
          />
        </div>
      </main>

      {/* Source drawer */}
      <SourceDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ConversationProvider>
      <AppShell />
    </ConversationProvider>
  );
}
