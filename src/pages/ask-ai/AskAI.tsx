import { useState, useRef, useEffect } from "react";
import { useDocuments } from "../../hooks/useDocuments";
import { useAskQuery } from "../../hooks/useQuery";
import type { Document, SourceResult } from "../../types/document";
import { useAuth } from "../../hooks/useAuth";

interface HistoryItem {
  query: string;
  answer: string;
  sources: SourceResult[];
  cacheHit: boolean;
  cacheSimilarity: number;
  processingTime: number;
}

function SourceCard({ source }: { source: SourceResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{source.filename}</span>
          <span className="text-xs text-gray-500">
            {(source.similarity * 100).toFixed(1)}% match
          </span>
        </div>
        <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {source.content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AskAI() {
  const [query, setQuery] = useState("");
  const [documentId, setDocumentId] = useState<string>("");
  const [topK, setTopK] = useState(5);
  const [includeSources, setIncludeSources] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null);
  const { user } = useAuth();
  const companyId = (user as { company_id?: string })?.company_id || "";

  const answerRef = useRef<HTMLDivElement>(null);
  const askMutation = useAskQuery(companyId);

  const { data: docsData } = useDocuments(companyId, { limit: 100 });
  const documents: Document[] = docsData?.data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setCurrentResult(null);

    try {
      const result = await askMutation.mutateAsync({
        query: query.trim(),
        documentId: documentId || undefined,
        topK,
        includeSources,
      });

      if (result?.data) {
        const item: HistoryItem = {
          query: query.trim(),
          answer: result.data.answer,
          sources: result.data.sources,
          cacheHit: result.data.cacheHit,
          cacheSimilarity: result.data.cacheSimilarity,
          processingTime: result.data.processingTime,
        };
        setHistory((prev) => [item, ...prev]);
        setCurrentResult(item);
      }
    } catch {
      // error handled by hook
    }
  };

  useEffect(() => {
    if (currentResult && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentResult]);

  const handleHistoryClick = (item: HistoryItem) => {
    setCurrentResult(item);
    setQuery(item.query);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left sidebar - History */}
      <div className="hidden md:flex md:w-72 flex-shrink-0 flex-col bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {history.length === 0 && (
            <p className="text-sm text-gray-400 p-2">No questions yet.</p>
          )}
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleHistoryClick(item)}
              className="w-full text-left p-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 truncate"
            >
              {item.query}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="document-filter"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                Document
              </label>
              <select
                id="document-filter"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Documents</option>
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.original_filename}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-indigo-600 hover:text-indigo-800 self-end pb-1"
            >
              {showAdvanced ? "Hide Advanced" : "Advanced Options"}
            </button>
          </div>

          {showAdvanced && (
            <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="w-32">
                <label
                  htmlFor="topK"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Top K ({topK})
                </label>
                <input
                  id="topK"
                  type="range"
                  min={1}
                  max={50}
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={(e) => setIncludeSources(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Include Sources
              </label>
            </div>
          )}
        </div>

        {/* Question form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              disabled={askMutation.isPending}
            />
            <button
              type="submit"
              disabled={!query.trim() || askMutation.isPending}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {askMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating answer...
                </>
              ) : (
                "Ask"
              )}
            </button>
          </div>
        </form>

        {/* Answer area */}
        <div ref={answerRef} className="flex-1 overflow-y-auto">
          {askMutation.isPending && !currentResult && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
              </div>
              <p className="text-sm text-gray-400 mt-4">Generating answer...</p>
            </div>
          )}

          {askMutation.isError && !currentResult && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-red-600 text-sm">
              Failed to get an answer. Please try again.
            </div>
          )}

          {!askMutation.isPending && !currentResult && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-400 text-sm">
                Ask a question to get started.
              </p>
            </div>
          )}

          {currentResult && (
            <div className="space-y-4">
              {/* Query bubble */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-900">
                  {currentResult.query}
                </p>
              </div>

              {/* Answer card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  {currentResult.cacheHit ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                      ⚡ Served from cache
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      Fresh response
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {currentResult.processingTime} ms
                  </span>
                </div>

                <div className="prose prose-sm max-w-none">
                  {currentResult.answer.split("\n").map((line, i) => (
                    <p key={i} className="text-gray-700 mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Sources */}
              {currentResult.sources.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Sources ({currentResult.sources.length})
                  </h3>
                  <div className="space-y-2">
                    {currentResult.sources.map((source, idx) => (
                      <SourceCard key={idx} source={source} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
