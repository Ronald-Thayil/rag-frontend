import { useState } from "react";
import { useDocument, useDocumentChunks } from "../../hooks/useDocuments";
import type { Document, Chunk } from "../../types/document";

interface DocumentDetailsDrawerProps {
  documentId: string | null;
  onClose: () => void;
  companyId: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800",
    ready: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    deleted: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}

function ChunkRow({ chunk }: { chunk: Chunk }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">
          Chunk {chunk.chunk_index}
        </span>
        <span className="text-gray-500">{chunk.token_count} tokens</span>
      </button>
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {chunk.content}
          </p>
        </div>
      )}
    </div>
  );
}

export function DocumentDetailsDrawer({
  documentId,
  onClose,
  companyId,
}: DocumentDetailsDrawerProps) {
  const { data, isLoading, isError } = useDocument(
    documentId || undefined,
    companyId,
  );
  const [chunkPage, setChunkPage] = useState(1);
  const chunkLimit = 10;
  const { data: chunksData, isLoading: chunksLoading } = useDocumentChunks(
    documentId || undefined,
    companyId,
    { page: chunkPage, limit: chunkLimit },
  );

  const doc: Document | undefined = data?.data || undefined;
  const chunks: Chunk[] = chunksData?.data?.data || [];
  const totalChunkPages = chunksData?.data?.totalPages || 1;

  return (
    <>
      {documentId && (
        <div className="fixed inset-0 z-40" onClick={onClose}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          documentId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Document Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading && (
              <div className="text-center py-12 text-gray-500">
                Loading document...
              </div>
            )}

            {isError && (
              <div className="text-center py-12 text-red-600">
                Failed to load document.
              </div>
            )}

            {!isLoading && !isError && !doc && (
              <div className="text-center py-12 text-gray-500">
                Document not found.
              </div>
            )}

            {doc && (
              <div className="space-y-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Filename</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {doc.filename}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Original Filename</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {doc.original_filename}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Type</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {doc.file_type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Size</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatBytes(doc.file_size_bytes)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <StatusBadge status={doc.status} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Page Count</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {doc.page_count ?? "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Chunk Count</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {doc.chunk_count ?? "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Uploaded Date</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(doc.created_at).toLocaleString()}
                    </dd>
                  </div>
                  {doc.completed_at && (
                    <div>
                      <dt className="text-sm text-gray-500">Completed Date</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {new Date(doc.completed_at).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {doc.error_message && (
                    <div>
                      <dt className="text-sm text-gray-500">Error</dt>
                      <dd className="text-sm font-medium text-red-600">
                        {doc.error_message}
                      </dd>
                    </div>
                  )}
                  {doc.metadata && Object.keys(doc.metadata).length > 0 && (
                    <div>
                      <dt className="text-sm text-gray-500">Metadata</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        <pre className="bg-gray-50 rounded-md p-3 text-xs overflow-x-auto">
                          {JSON.stringify(doc.metadata, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Chunks
                  </h3>

                  {chunksLoading && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Loading chunks...
                    </div>
                  )}

                  {!chunksLoading && chunks.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No chunks available.
                    </div>
                  )}

                  {!chunksLoading && chunks.length > 0 && (
                    <div className="space-y-2">
                      {chunks.map((chunk) => (
                        <ChunkRow key={chunk.id} chunk={chunk} />
                      ))}

                      {totalChunkPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <button
                            onClick={() =>
                              setChunkPage((p) => Math.max(1, p - 1))
                            }
                            disabled={chunkPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                          >
                            Previous
                          </button>
                          <span className="text-sm text-gray-600">
                            Page {chunkPage} of {totalChunkPages}
                          </span>
                          <button
                            onClick={() =>
                              setChunkPage((p) =>
                                Math.min(totalChunkPages, p + 1),
                              )
                            }
                            disabled={chunkPage === totalChunkPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
