import { useEffect, useRef } from 'react';
import { Trash2, Edit, ExternalLink, Scissors } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'node' | 'connection';
  onDelete: () => void;
  onEdit?: () => void;
  onViewDetails?: () => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, type, onDelete, onEdit, onViewDetails, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-background border border-border rounded-lg shadow-lg py-1 z-[100] min-w-[180px]"
      style={{ left: x, top: y }}
    >
      {type === 'node' ? (
        <>
          {onEdit && (
            <button
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
              onClick={() => handleAction(onEdit)}
            >
              <Edit className="w-4 h-4" />
              Edit Properties
            </button>
          )}
          {onViewDetails && (
            <button
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
              onClick={() => handleAction(onViewDetails)}
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </button>
          )}
          <div className="border-t border-border my-1" />
          <button
            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 text-destructive"
            onClick={() => handleAction(onDelete)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Node
          </button>
        </>
      ) : (
        <>
          {onEdit && (
            <button
              className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
              onClick={() => handleAction(onEdit)}
            >
              <Edit className="w-4 h-4" />
              Edit Connection
            </button>
          )}
          <button
            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2 text-destructive"
            onClick={() => handleAction(onDelete)}
          >
            <Scissors className="w-4 h-4" />
            Delete Connection
          </button>
        </>
      )}
    </div>
  );
}
