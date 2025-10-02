import { useState } from 'react';
import { Circle, Square, Diamond, Hexagon, Zap, Trash2 } from 'lucide-react';
import { CardType } from './CardSidebar';

interface FlowCardProps {
  id: string;
  type: CardType;
  x: number;
  y: number;
  label: string;
  zoom: number;
  panX: number;
  panY: number;
  isSelected: boolean;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onConnectionStart: (id: string, x: number, y: number) => void;
  onConnectionEnd: (id: string) => void;
  onDelete: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onSelect: (id: string) => void;
}

const cardConfig: Record<CardType, { color: string; bgColor: string; icon: React.ReactNode; shape: string }> = {
  start: { 
    color: 'border-green-500 bg-green-50', 
    bgColor: 'bg-green-500',
    icon: <Circle className="w-4 h-4" />,
    shape: 'rounded-full'
  },
  process: { 
    color: 'border-blue-500 bg-blue-50', 
    bgColor: 'bg-blue-500',
    icon: <Square className="w-4 h-4" />,
    shape: 'rounded-lg'
  },
  decision: { 
    color: 'border-yellow-500 bg-yellow-50', 
    bgColor: 'bg-yellow-500',
    icon: <Diamond className="w-4 h-4" />,
    shape: 'rounded-lg'
  },
  input: { 
    color: 'border-purple-500 bg-purple-50', 
    bgColor: 'bg-purple-500',
    icon: <Hexagon className="w-4 h-4" />,
    shape: 'rounded-lg'
  },
  action: { 
    color: 'border-orange-500 bg-orange-50', 
    bgColor: 'bg-orange-500',
    icon: <Zap className="w-4 h-4" />,
    shape: 'rounded-lg'
  },
};

export function FlowCard({
  id,
  type,
  x,
  y,
  label,
  zoom,
  panX,
  panY,
  isSelected,
  onUpdatePosition,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  onLabelChange,
  onSelect,
}: FlowCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const config = cardConfig[type];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Select the card
    onSelect(id);
    
    setIsDragging(true);

    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate offset from card position to mouse click in canvas space
    const mouseCanvasX = (e.clientX - rect.left - panX) / zoom;
    const mouseCanvasY = (e.clientY - rect.top - panY) / zoom;
    const offsetX = mouseCanvasX - x;
    const offsetY = mouseCanvasY - y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newMouseCanvasX = (moveEvent.clientX - rect.left - panX) / zoom;
      const newMouseCanvasY = (moveEvent.clientY - rect.top - panY) / zoom;
      
      const newX = newMouseCanvasX - offsetX;
      const newY = newMouseCanvasY - offsetY;
      
      onUpdatePosition(id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleConnectionStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onConnectionStart(id, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleConnectionEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectionEnd(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`absolute cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ 
        left: `${x}px`, 
        top: `${y}px`, 
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleConnectionEnd}
    >
      <div className={`relative border-2 ${config.color} ${config.shape} bg-white shadow-lg min-w-[140px] group ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`${config.bgColor} p-1 rounded text-white`}>
              {config.icon}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={label}
                onChange={(e) => onLabelChange(id, e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="flex-1 px-1 border rounded"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="flex-1"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {label}
              </span>
            )}
          </div>
        </div>
        
        {/* Connection points */}
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-400 hover:border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleConnectionStart}
          title="Drag to connect"
        />
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-400 hover:border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleConnectionStart}
          title="Drag to connect"
        />
        <div 
          className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-400 hover:border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleConnectionStart}
          title="Drag to connect"
        />
        <div 
          className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-400 hover:border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleConnectionStart}
          title="Drag to connect"
        />

        {/* Delete button */}
        <button
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
          onClick={handleDelete}
          title="Delete card"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}