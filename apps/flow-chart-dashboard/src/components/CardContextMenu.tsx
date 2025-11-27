import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network } from 'lucide-react';
import { CardType } from './CardSidebar';

interface CardContextMenuProps {
  x: number;
  y: number;
  onSelectCard: (type: CardType) => void;
  onClose: () => void;
}

const cardOptions: Array<{ type: CardType; label: string; icon: React.ReactNode; color: string }> = [
  { type: 'api', label: 'API Gateway', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500' },
  { type: 'database', label: 'Database', icon: <Database className="w-4 h-4" />, color: 'bg-green-500' },
  { type: 'service', label: 'Service', icon: <Server className="w-4 h-4" />, color: 'bg-purple-500' },
  { type: 'frontend', label: 'Frontend', icon: <Cloud className="w-4 h-4" />, color: 'bg-cyan-500' },
  { type: 'backend', label: 'Backend', icon: <Layers className="w-4 h-4" />, color: 'bg-indigo-500' },
  { type: 'queue', label: 'Message Queue', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-500' },
  { type: 'cache', label: 'Cache', icon: <HardDrive className="w-4 h-4" />, color: 'bg-red-500' },
  { type: 'loadbalancer', label: 'Load Balancer', icon: <Network className="w-4 h-4" />, color: 'bg-yellow-500' },
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
          <span className="text-muted-foreground">Create new component</span>
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