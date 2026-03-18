import { useEffect } from 'react';
import { X, Database, Globe, ExternalLink } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import ConfidenceIndicator from './ConfidenceIndicator';

function SourceItem({ source, accent }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-[#F2F0EB] last:border-0">
      <div
        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: accent }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[#1A1A1A] text-xs font-medium leading-snug">{source.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[#6B6B6B] text-[10px]">{source.type}</span>
          {source.date && (
            <>
              <span className="text-[#E0DDD7]">·</span>
              <span className="text-[#6B6B6B] text-[10px]">{source.date}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ReferenceItem({ ref: reference }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-[#F2F0EB] last:border-0">
      <span className="text-[#6B6B6B] text-[10px] font-mono w-5 flex-shrink-0 mt-0.5">
        [{reference.id}]
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[#1A1A1A] text-[11px] font-medium leading-snug">{reference.title}</p>
        <p className="text-[#6B6B6B] text-[10px] mt-0.5">{reference.source}</p>
        {reference.url && (
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#2A9D8F] text-[10px] mt-0.5 hover:underline"
          >
            Open <ExternalLink size={9} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function SourceDrawer() {
  const { sourceDrawerOpen, activeSourceData, closeSourceDrawer } = useConversation();

  // Close on Escape
  useEffect(() => {
    if (!sourceDrawerOpen) return;
    const handler = (e) => { if (e.key === 'Escape') closeSourceDrawer(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sourceDrawerOpen, closeSourceDrawer]);

  const data = activeSourceData;

  return (
    <>
      {/* Backdrop (mobile) */}
      {sourceDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={closeSourceDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        role="complementary"
        aria-label="Sources and confidence"
        className={`
          flex flex-col h-full bg-white border-l border-[#E0DDD7] overflow-hidden transition-all duration-300
          ${sourceDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{
          width: sourceDrawerOpen ? 340 : 0,
          minWidth: sourceDrawerOpen ? 340 : 0,
          maxWidth: 340,
        }}
      >
        {sourceDrawerOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E0DDD7] flex-shrink-0">
              <h2 className="text-[#1A1A1A] text-sm font-semibold">Sources & Confidence</h2>
              <button
                onClick={closeSourceDrawer}
                className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F0EB] rounded-md transition-colors"
                aria-label="Close source drawer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {!data ? (
                <div className="flex items-center justify-center h-32 text-[#6B6B6B] text-xs">
                  Select a message to view sources
                </div>
              ) : (
                <div className="px-4 py-4 space-y-5">
                  {/* Confidence */}
                  {data.confidence && (
                    <section>
                      <h3 className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold mb-2">
                        Confidence
                      </h3>
                      <ConfidenceIndicator
                        level={data.confidence.level}
                        explanation={data.confidence.explanation}
                      />
                    </section>
                  )}

                  {/* Pathways data */}
                  {data.sources?.pathways?.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <Database size={13} className="text-[#2A9D8F]" />
                        <h3 className="text-[#2A9D8F] text-[10px] uppercase tracking-wider font-semibold">
                          Pathways data
                        </h3>
                      </div>
                      <div className="bg-[rgba(42,157,143,0.05)] border border-[rgba(42,157,143,0.15)] rounded-lg px-3 py-1">
                        {data.sources.pathways.map((src, i) => (
                          <SourceItem key={i} source={src} accent="#2A9D8F" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* External sources */}
                  {data.sources?.external?.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={13} className="text-[#6B6B6B]" />
                        <h3 className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold">
                          External sources
                        </h3>
                      </div>
                      <div className="bg-[#F2F0EB] border border-[#E0DDD7] rounded-lg px-3 py-1">
                        {data.sources.external.map((src, i) => (
                          <SourceItem key={i} source={src} accent="#6B6B6B" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* References */}
                  {data.references?.length > 0 && (
                    <section>
                      <h3 className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold mb-2">
                        References
                      </h3>
                      <div className="bg-[#FAFAF8] border border-[#E0DDD7] rounded-lg px-3 py-1">
                        {data.references.map((ref) => (
                          <ReferenceItem key={ref.id} ref={ref} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Persistent footer */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-[#E0DDD7] bg-[#F2F0EB]">
              <p className="text-[#6B6B6B] text-[10px] leading-relaxed">
                Pathways data reflects verified segmentation methodology. External sources are used to supplement where Pathways coverage is incomplete.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
