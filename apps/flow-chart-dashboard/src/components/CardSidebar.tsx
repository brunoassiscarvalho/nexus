import { useDrag } from 'react-dnd';
import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network } from 'lucide-react';

export type CardType = 'api' | 'database' | 'service' | 'frontend' | 'backend' | 'queue' | 'cache' | 'loadbalancer';

interface CardTemplate {
  type: CardType;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const cardTemplates: CardTemplate[] = [
  { 
    type: 'api', 
    label: 'API Gateway', 
    color: 'bg-blue-500', 
    icon: <Globe className="w-5 h-5" />
  },
  { 
    type: 'database', 
    label: 'Database', 
    color: 'bg-green-500', 
    icon: <Database className="w-5 h-5" />
  },
  { 
    type: 'service', 
    label: 'Service', 
    color: 'bg-purple-500', 
    icon: <Server className="w-5 h-5" />
  },
  { 
    type: 'frontend', 
    label: 'Frontend', 
    color: 'bg-cyan-500', 
    icon: <Cloud className="w-5 h-5" />
  },
  { 
    type: 'backend', 
    label: 'Backend', 
    color: 'bg-indigo-500', 
    icon: <Layers className="w-5 h-5" />
  },
  { 
    type: 'queue', 
    label: 'Message Queue', 
    color: 'bg-orange-500', 
    icon: <Zap className="w-5 h-5" />
  },
  { 
    type: 'cache', 
    label: 'Cache', 
    color: 'bg-red-500', 
    icon: <HardDrive className="w-5 h-5" />
  },
  { 
    type: 'loadbalancer', 
    label: 'Load Balancer', 
    color: 'bg-yellow-500', 
    icon: <Network className="w-5 h-5" />
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
      <h2 className="mb-4">Components</h2>
      <div className="space-y-3">
        {cardTemplates.map((template) => (
          <DraggableCardTemplate key={template.type} template={template} />
        ))}
      </div>
      <div className="mt-8 p-4 bg-card rounded-lg border border-border">
        <h3 className="mb-2">How to use:</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Drag components to canvas</li>
          <li>• Click node edge to connect</li>
          <li>• Double-click to view details</li>
        </ul>
      </div>
    </div>
  );
}