import { useDrag } from 'react-dnd';
import { Circle, Square, Diamond, Hexagon, Zap } from 'lucide-react';

export type CardType = 'start' | 'process' | 'decision' | 'input' | 'action';

interface CardTemplate {
  type: CardType;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const cardTemplates: CardTemplate[] = [
  { 
    type: 'start', 
    label: 'Start/End', 
    color: 'bg-green-500', 
    icon: <Circle className="w-5 h-5" />
  },
  { 
    type: 'process', 
    label: 'Process', 
    color: 'bg-blue-500', 
    icon: <Square className="w-5 h-5" />
  },
  { 
    type: 'decision', 
    label: 'Decision', 
    color: 'bg-yellow-500', 
    icon: <Diamond className="w-5 h-5" />
  },
  { 
    type: 'input', 
    label: 'Input/Output', 
    color: 'bg-purple-500', 
    icon: <Hexagon className="w-5 h-5" />
  },
  { 
    type: 'action', 
    label: 'Action', 
    color: 'bg-orange-500', 
    icon: <Zap className="w-5 h-5" />
  },
];

function DraggableCardTemplate({ template }: { template: CardTemplate }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { cardType: template.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg border-2 border-border bg-card cursor-move transition-all hover:shadow-lg ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${template.color} p-2 rounded-md text-white`}>
          {template.icon}
        </div>
        <span className="select-none">{template.label}</span>
      </div>
    </div>
  );
}

export function CardSidebar() {
  return (
    <div className="w-64 bg-muted border-r border-border p-4 overflow-y-auto">
      <h2 className="mb-4">Card Types</h2>
      <div className="space-y-3">
        {cardTemplates.map((template) => (
          <DraggableCardTemplate key={template.type} template={template} />
        ))}
      </div>
      <div className="mt-8 p-4 bg-card rounded-lg border border-border">
        <h3 className="mb-2">How to use:</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Drag cards to canvas</li>
          <li>• Click card edge to connect</li>
          <li>• Drag to another card</li>
        </ul>
      </div>
    </div>
  );
}