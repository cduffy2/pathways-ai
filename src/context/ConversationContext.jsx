import { createContext, useState, useCallback, useRef } from 'react';

export const ConversationContext = createContext(null);

const generateId = () => Math.random().toString(36).slice(2, 10);

const generateTitle = (text) => {
  const words = text.trim().split(/\s+/);
  return words.slice(0, 6).join(' ') + (words.length > 6 ? '…' : '');
};

// Stub: simulate streaming assistant response
const simulateAssistantResponse = async (userMessage, onToken, onDone) => {
  const responses = [
    `**Pathways data overview**\n\nBased on your query about "${userMessage.slice(0, 40)}...", here's what the Pathways platform shows:\n\n`,
    `### Key findings\n\n- The Pathways segmentation methodology identifies **8 core vulnerability dimensions** including household poverty, geographic isolation, and health system access.\n- Data coverage spans **23 countries** across Sub-Saharan Africa and South Asia.\n- Subnational data is available for **14 priority countries**.\n\n`,
    `### Recommended next steps\n\nYou can narrow this down by specifying a country or health area. The segment profiles for **rural women aged 18–35** in high-burden regions show the strongest concentration of compound risk factors.\n\n`,
    `*Source: Pathways segmentation platform, 2024 baseline data.*`,
  ];

  const fullText = responses.join('');
  const tokens = fullText.split(/(?<=\s)/);

  for (const token of tokens) {
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 20));
    onToken(token);
  }

  onDone({
    sources: {
      pathways: [
        { name: 'Pathways Segmentation Database', type: 'Segmentation data', date: '2024' },
        { name: 'Country Vulnerability Profiles', type: 'Country report', date: '2023' },
      ],
      external: [
        { name: 'DHS Programme', type: 'Survey data', date: '2022' },
      ],
    },
    confidence: {
      level: 'high',
      explanation: 'This response draws primarily from verified Pathways segmentation data for the requested geography.',
    },
    references: [
      { id: 1, title: 'Pathways Health Segmentation Methodology', source: 'Gates Foundation', url: null },
      { id: 2, title: 'DHS Household Survey — Senegal 2022', source: 'DHS Programme', url: null },
    ],
  });
};

export function ConversationProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [sourceDrawerOpen, setSourceDrawerOpen] = useState(false);
  const [activeSourceData, setActiveSourceData] = useState(null);
  const [workflowBannerVisible, setWorkflowBannerVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-5-2');

  const streamingTextRef = useRef('');

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createConversation = useCallback(() => {
    const id = generateId();
    const newConv = {
      id,
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(id);
    setSourceDrawerOpen(false);
    setActiveSourceData(null);
    setWorkflowBannerVisible(false);
    return id;
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  const renameConversation = useCallback((id, title) => {
    setConversations((prev) =>
      prev.map((c) => c.id === id ? { ...c, title } : c)
    );
  }, []);

  const sendMessage = useCallback(async (text, conversationId = null) => {
    setError(null);

    let convId = conversationId || activeConversationId;

    if (!convId) {
      convId = generateId();
      const newConv = {
        id: convId,
        title: generateTitle(text),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(convId);
    }

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const assistantMessageId = generateId();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
      sourceData: null,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title: c.messages.length === 0 ? generateTitle(text) : c.title,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, userMessage, assistantMessage],
            }
          : c
      )
    );

    setIsStreaming(true);
    streamingTextRef.current = '';

    try {
      await simulateAssistantResponse(
        text,
        (token) => {
          streamingTextRef.current += token;
          const currentText = streamingTextRef.current;
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: currentText }
                        : m
                    ),
                  }
                : c
            )
          );
        },
        (sourceData) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, isStreaming: false, sourceData }
                        : m
                    ),
                  }
                : c
            )
          );
          setIsStreaming(false);
          // Show workflow banner after first exchange
          setWorkflowBannerVisible(true);
        }
      );
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, isStreaming: false, content: '', error: true }
                    : m
                ),
              }
            : c
        )
      );
      setIsStreaming(false);
    }
  }, [activeConversationId]);

  const openSourceDrawer = useCallback((sourceData) => {
    setActiveSourceData(sourceData);
    setSourceDrawerOpen(true);
  }, []);

  const closeSourceDrawer = useCallback(() => {
    setSourceDrawerOpen(false);
  }, []);

  const retryLastMessage = useCallback(() => {
    if (!activeConversation) return;
    const messages = activeConversation.messages;
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // Remove failed assistant message and resend
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages: c.messages.filter((m) => !m.error) }
            : c
        )
      );
      sendMessage(lastUser.content, activeConversationId);
    }
  }, [activeConversation, activeConversationId, sendMessage]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        activeConversation,
        activeConversationId,
        setActiveConversationId,
        isStreaming,
        error,
        sourceDrawerOpen,
        activeSourceData,
        workflowBannerVisible,
        selectedModel,
        setSelectedModel,
        createConversation,
        deleteConversation,
        renameConversation,
        sendMessage,
        openSourceDrawer,
        closeSourceDrawer,
        retryLastMessage,
        dismissWorkflowBanner: () => setWorkflowBannerVisible(false),
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
