import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network, ArrowLeft, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CardType } from './CardSidebar';

interface ComponentData {
  id: string;
  type: CardType;
  label: string;
  description?: string;
  x: number;
  y: number;
}

interface ComponentDetailPageProps {
  component: ComponentData;
  onBack: () => void;
  onEdit: () => void;
}

const typeConfig: Record<CardType, { 
  label: string; 
  icon: React.ReactNode; 
  color: string;
  bgColor: string;
  description: string;
}> = {
  api: {
    label: 'API Gateway',
    icon: <Globe className="w-8 h-8" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    description: 'Manages and routes API requests to appropriate services',
  },
  database: {
    label: 'Database',
    icon: <Database className="w-8 h-8" />,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    description: 'Stores and manages application data persistently',
  },
  service: {
    label: 'Service',
    icon: <Server className="w-8 h-8" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    description: 'Independent microservice handling specific business logic',
  },
  frontend: {
    label: 'Frontend',
    icon: <Cloud className="w-8 h-8" />,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    description: 'User-facing interface and client-side application',
  },
  backend: {
    label: 'Backend',
    icon: <Layers className="w-8 h-8" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    description: 'Server-side application handling business logic',
  },
  queue: {
    label: 'Message Queue',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    description: 'Asynchronous message processing and event streaming',
  },
  cache: {
    label: 'Cache',
    icon: <HardDrive className="w-8 h-8" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    description: 'Fast in-memory data storage for performance optimization',
  },
  loadbalancer: {
    label: 'Load Balancer',
    icon: <Network className="w-8 h-8" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    description: 'Distributes traffic across multiple service instances',
  },
};

export function ComponentDetailPage({ component, onBack, onEdit }: ComponentDetailPageProps) {
  const config = typeConfig[component.type];

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Canvas
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Component
          </Button>
        </div>

        {/* Component Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`${config.bgColor} p-4 rounded-lg text-white`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="mb-2">{component.label}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </div>
              <Badge variant="secondary">{config.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground">
                {component.description || 'No description provided yet. Click "Edit Component" to add one.'}
              </p>
            </div>

            {/* Technical Details */}
            <div>
              <h3 className="mb-3">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Component ID</p>
                  <p className="break-all">{component.id}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Type</p>
                  <p>{config.label}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Position X</p>
                  <p>{Math.round(component.x)}px</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Position Y</p>
                  <p>{Math.round(component.y)}px</p>
                </div>
              </div>
            </div>

            {/* Golden Path Information */}
            <div>
              <h3 className="mb-3">Platform Engineering Context</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-muted-foreground">
                  This component is part of your golden path for platform engineering. 
                  Use the connections to define data flow and dependencies between components.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
