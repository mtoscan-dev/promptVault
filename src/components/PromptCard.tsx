import { formatDistanceToNow } from 'date-fns';
import { GitBranch, Clock, Trash2, Edit3 } from 'lucide-react';
import { Prompt } from '@/types';
import { TagBadge } from '@/components/TagBadge';

interface PromptCardProps {
  prompt: Prompt;
  onSelect: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onSelect, onDelete }: PromptCardProps) {
  const currentVersion = prompt.versions.find(v => v.id === prompt.currentVersionId);
  const content = currentVersion?.content || '';
  
  return (
    <div
      className="group bg-gray-900/80 border border-gray-700/50 rounded-lg p-4 hover:border-green-600/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-900/20"
      onClick={() => onSelect(prompt)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h3 className="text-green-400 font-mono font-bold text-lg flex items-center gap-2">
            <span className="text-gray-500">$</span>
            {prompt.title}
          </h3>
          <p className="text-gray-500 text-sm font-mono mt-1"># {prompt.description}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prompt);
            }}
            className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-gray-800 rounded transition-colors"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <div className="bg-black/40 rounded p-3 mb-3 border border-gray-800">
        <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap line-clamp-3">
          {content}
        </pre>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {prompt.tags.map(tag => (
          <TagBadge key={tag} name={tag} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            v{prompt.versions.length}
          </span>
          <span className="flex items-center gap-1" suppressHydrationWarning>
            <Clock size={12} />
            {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
          </span>
        </div>
        <span className="text-gray-700">id:{prompt.id.slice(0, 8)}</span>
      </div>
    </div>
  );
}
