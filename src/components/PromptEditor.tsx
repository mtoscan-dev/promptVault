import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Save, GitBranch, Clock, ChevronDown, Plus } from "lucide-react";
import { Prompt, PromptVersion } from "@/types";
import { cn } from "@/utils/cn";

interface PromptEditorProps {
  prompt: Prompt | null;
  initialContent?: string;
  onClose: () => void;
  onSave: (
    id: string | null,
    content: string,
    title: string,
    description: string,
  ) => void;
  onVersionSwitch: (promptId: string, versionId: string) => void;
}

export function PromptEditor({
  prompt,
  initialContent,
  onClose,
  onSave,
  onVersionSwitch,
}: PromptEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(
    null,
  );

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      const currentVersion = prompt.versions.find(
        (v) => v.id === prompt.currentVersionId,
      );
      setContent(currentVersion?.content || "");
      setSelectedVersion(currentVersion || null);
    } else {
      setTitle("");
      setDescription("");
      setContent(initialContent || "");
      setSelectedVersion(null);
    }
  }, [prompt, initialContent]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(prompt?.id || null, content, title, description);
    onClose();
  };

  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version);
    setContent(version.content);
    if (prompt) {
      onVersionSwitch(prompt.id, version.id);
    }
    setShowVersions(false);
  };

  const isNewPrompt = !prompt;
  const hasChanges = prompt
    ? content !==
        prompt.versions.find((v) => v.id === prompt.currentVersionId)
          ?.content ||
      title !== prompt.title ||
      description !== prompt.description
    : title.trim() !== "" || content.trim() !== "";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono">
              {isNewPrompt ? "$ new_prompt" : "$ edit_prompt"}
            </span>
            {prompt && (
              <div className="relative">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded text-sm font-mono text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <GitBranch size={14} className="text-purple-400" />v
                  {selectedVersion?.versionNumber || prompt.versions.length}
                  <ChevronDown size={14} />
                </button>

                {showVersions && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[250px]">
                    <div className="p-2 border-b border-gray-700 text-xs text-gray-500 font-mono">
                      VERSION HISTORY
                    </div>
                    {prompt.versions
                      .slice()
                      .reverse()
                      .map((version) => (
                        <button
                          key={version.id}
                          onClick={() => handleVersionSelect(version)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm font-mono flex items-center justify-between hover:bg-gray-700 transition-colors",
                            version.id === selectedVersion?.id
                              ? "bg-gray-700 text-green-400"
                              : "text-gray-300",
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <GitBranch size={12} />
                            Version {version.versionNumber}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            {format(version.createdAt, "MMM d, yyyy")}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-gray-500 font-mono mb-1">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title..."
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-green-400 font-mono focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 font-mono mb-1">
              DESCRIPTION
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-300 font-mono text-sm focus:outline-none focus:border-green-600 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 font-mono mb-1">
              PROMPT CONTENT
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={12}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-gray-200 font-mono text-sm focus:outline-none focus:border-green-600 transition-colors resize-none"
            />
          </div>

          {/* Info about auto-tagging */}
          <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-500 font-mono">
            <span className="text-purple-400">ℹ</span> Tags will be
            automatically generated based on content keywords
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <div className="text-xs text-gray-600 font-mono">
            {hasChanges && (
              <span className="text-yellow-500">● Unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-mono text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className={cn(
                "px-4 py-2 text-sm font-mono rounded flex items-center gap-2 transition-colors",
                title.trim() && content.trim()
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed",
              )}
            >
              {isNewPrompt ? <Plus size={16} /> : <Save size={16} />}
              {isNewPrompt ? "Create Prompt" : "Save New Version"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
