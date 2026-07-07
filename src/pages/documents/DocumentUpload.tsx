import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUploadDocument } from "../../hooks/useDocuments";
import { useAuth } from "../../hooks/useAuth";

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".csv"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 50;

export default function DocumentUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const companyId = (user as { company_id?: string })?.company_id || "";

  const uploadMutation = useUploadDocument(companyId);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const validateFile = useCallback((f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
    }
    if (f.size === 0) {
      return "File is empty";
    }
    return null;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFileError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const error = validateFile(f);
    if (error) {
      setFileError(error);
      setFile(null);
      e.target.value = "";
      return;
    }
    setFile(f);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_TAG_LENGTH) {
      setFileError(`Tag must be at most ${MAX_TAG_LENGTH} characters`);
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setFileError(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }
    if (tags.includes(trimmed)) {
      setFileError("Tag already exists");
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput("");
    setFileError(null);
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setFileError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const metadata: Record<string, unknown> = {};
    if (title.trim()) metadata.title = title.trim();
    if (description.trim()) metadata.description = description.trim();
    if (tags.length > 0) metadata.tags = tags;

    formData.append("metadata", JSON.stringify(metadata));

    const result = await uploadMutation.mutateAsync(formData);
    if (result?.data) {
      setFile(null);
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
      setFileError(null);
      const fileInput = document.getElementById(
        "file-input",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      navigate("/documents");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/documents"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          &larr; Back to Documents
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Upload Document
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              id="file-input"
              type="file"
              accept={ALLOWED_EXTENSIONS.join(",")}
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {file && (
              <p className="mt-1 text-sm text-gray-500">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= MAX_TITLE_LENGTH)
                  setTitle(e.target.value);
              }}
              maxLength={MAX_TITLE_LENGTH}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional document title"
            />
            <p className="mt-1 text-xs text-gray-400">
              {title.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH)
                  setDescription(e.target.value);
              }}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional description"
            />
            <p className="mt-1 text-xs text-gray-400">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <div className="flex gap-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                maxLength={MAX_TAG_LENGTH}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Type a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {tags.length}/{MAX_TAGS} tags
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </button>
            <Link
              to="/documents"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
