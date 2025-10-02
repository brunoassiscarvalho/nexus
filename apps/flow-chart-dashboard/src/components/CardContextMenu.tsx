import { Circle, Square, Diamond, Hexagon, Zap } from 'lucide-react';
import { CardType } from './CardSidebar';

interface CardContextMenuProps {
  x: number;
  y: number;
  onSelectCard: (type: CardType) => void;
  onClose: () => void;
}

const cardOptions: Array<{ type: CardType; label: string; icon: React.ReactNode; color: string }> = [
  { type: 'start', label: 'Start/End', icon: <Circle className="w-4 h-4" />, color: 'bg-green-500' },
  { type: 'process', label: 'Process', icon: <Square className="w-4 h-4" />, color: 'bg-blue-500' },
  { type: 'decision', label: 'Decision', icon: <Diamond className="w-4 h-4" />, color: 'bg-yellow-500' },
  { type: 'input', label: 'Input/Output', icon: <Hexagon className="w-4 h-4" />, color: 'bg-purple-500' },
  { type: 'action', label: 'Action', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-500' },
];

export function CardContextMenu({ x, y, onSelectCard, onClose }: CardContextMenuProps) {
  return (
    <>
      {/* Backdrop to close menu */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />
      
      {/* Context menu */}
      <div
        className="fixed z-[101] bg-card border border-border rounded-lg shadow-xl p-2 min-w-[180px]"
        style={{ left: `${x}px`, top: `${y}px` }}
      >
        <div className="mb-2 px-2 py-1 border-b border-border">
          <span className="text-muted-foreground">Create new card</span>
        </div>
        <div className="space-y-1">
          {cardOptions.map((option) => (
            <button
              key={option.type}
              className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-accent transition-colors"
              onClick={() => {
                onSelectCard(option.type);
                onClose();
              }}
            >
              <div className={`${option.color} p-1 rounded text-white`}>
                {option.icon}
              </div>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}