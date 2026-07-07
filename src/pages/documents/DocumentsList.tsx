import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDocuments,
  useRefreshDocumentStatus,
} from "../../hooks/useDocuments";
import { DocumentDetailsDrawer } from "../../components/Document/DocumentDetailsDrawer";
import type { Document } from "../../types/document";
import { useAuth } from "../../hooks/useAuth";

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

export default function DocumentsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const limit = 20;
  const { user } = useAuth();
  const companyId = (user as { company_id?: string })?.company_id || "";

  const params: Record<string, unknown> = { page, limit };
  if (search) params.search = search;

  const { data, isLoading, isError, error } = useDocuments(companyId, params);
  const refreshStatus = useRefreshDocumentStatus(companyId);

  const documents: Document[] = data?.data?.data || [];
  const totalPages = data?.data?.totalPages || 1;

  const handleRefresh = (id: string) => {
    refreshStatus.mutate(id);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Link
          to="/documents/upload"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          + Upload Document
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">
          Loading documents...
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-600">
          Error loading documents:{" "}
          {(error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || (error as Error).message}
        </div>
      )}

      {!isLoading && !isError && documents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No documents found.
        </div>
      )}

      {!isLoading && !isError && documents.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chunks
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doc.original_filename}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.file_type?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBytes(doc.file_size_bytes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.chunk_count ?? "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedDocId(doc.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRefresh(doc.id)}
                        disabled={refreshStatus.isPending}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        Refresh Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <DocumentDetailsDrawer
        documentId={selectedDocId}
        onClose={() => setSelectedDocId(null)}
        companyId={companyId || ""}
      />
    </div>
  );
}
