import { useState } from 'react';
import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network, Trash2 } from 'lucide-react';
import { CardType } from './CardSidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  onDoubleClick: (id: string) => void;
}

const cardConfig: Record<CardType, { color: string; bgColor: string; icon: React.ReactNode; shape: string }> = {
  api: { 
    color: 'border-blue-500 bg-blue-50', 
    bgColor: 'bg-blue-500',
    icon: <Globe className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  database: { 
    color: 'border-green-500 bg-green-50', 
    bgColor: 'bg-green-500',
    icon: <Database className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  service: { 
    color: 'border-purple-500 bg-purple-50', 
    bgColor: 'bg-purple-500',
    icon: <Server className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  frontend: { 
    color: 'border-cyan-500 bg-cyan-50', 
    bgColor: 'bg-cyan-500',
    icon: <Cloud className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  backend: { 
    color: 'border-indigo-500 bg-indigo-50', 
    bgColor: 'bg-indigo-500',
    icon: <Layers className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  queue: { 
    color: 'border-orange-500 bg-orange-50', 
    bgColor: 'bg-orange-500',
    icon: <Zap className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  cache: { 
    color: 'border-red-500 bg-red-50', 
    bgColor: 'bg-red-500',
    icon: <HardDrive className="w-6 h-6" />,
    shape: 'rounded-lg'
  },
  loadbalancer: { 
    color: 'border-yellow-500 bg-yellow-50', 
    bgColor: 'bg-yellow-500',
    icon: <Network className="w-6 h-6" />,
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
  onDoubleClick,
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

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(id);
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            data-flow-card
            className={`absolute cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
            style={{ 
              left: `${x}px`, 
              top: `${y}px`, 
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleConnectionEnd}
            onDoubleClick={handleDoubleClick}
          >
            <div className={`relative border-2 ${config.color} ${config.shape} bg-white shadow-lg group ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
              <div className="p-4">
                <div className={`${config.bgColor} p-2 rounded text-white`}>
                  {config.icon}
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
                title="Delete component"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}