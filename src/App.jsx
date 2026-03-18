import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ConversationProvider } from './context/ConversationContext';
import { useConversation } from './hooks/useConversation';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SourceDrawer from './components/SourceDrawer';

function AppShell() {
  const { openSourceDrawer, activeSourceData } = useConversation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSourceDrawer = () => {
    if (activeSourceData) {
      openSourceDrawer(activeSourceData);
    }
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

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-30 flex-shrink-0 transition-transform duration-300 md:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ height: '100%' }}
      >
        <Sidebar />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatArea onOpenSourceDrawer={handleOpenSourceDrawer} />
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
