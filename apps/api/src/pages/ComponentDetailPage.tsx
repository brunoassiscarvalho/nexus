import { useParams, useNavigate } from 'react-router-dom';
import { useFlow, Card } from '../contexts/FlowContext';
import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network, ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CardType } from '../components/CardSidebar';

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
    description: 'User interface and client-side application logic',
  },
  backend: {
    label: 'Backend',
    icon: <Layers className="w-8 h-8" />,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500',
    description: 'Server-side application logic and business rules',
  },
  queue: {
    label: 'Message Queue',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    description: 'Asynchronous message processing and event handling',
  },
  cache: {
    label: 'Cache',
    icon: <HardDrive className="w-8 h-8" />,
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    description: 'Temporary data storage for improved performance',
  },
  loadbalancer: {
    label: 'Load Balancer',
    icon: <Network className="w-8 h-8" />,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    description: 'Distributes traffic across multiple servers',
  },
};

export function ComponentDetailPage() {
  const { designId, componentId } = useParams<{ designId: string; componentId: string }>();
  const navigate = useNavigate();
  const { currentDesign } = useFlow();

  const component = currentDesign?.data.cards.find((c: Card) => c.id === componentId);
  const config = component ? typeConfig[component.type] : null;

  const handleBack = () => {
    navigate(`/designs/${designId}`);
  };

  const handleEdit = () => {
    navigate(`/designs/${designId}/component/${componentId}/edit`);
  };

  if (!component || !config) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Component not found</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Canvas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full bg-background overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Canvas
          </Button>
        </div>

        <UICard>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`${config.bgColor} p-4 rounded-lg text-white`}>
                  {config.icon}
                </div>
                <div>
                  <CardTitle className="mb-2">{component.label}</CardTitle>
                  <CardDescription>{config.label}</CardDescription>
                </div>
              </div>
              <Button onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground">
                {component.description || config.description}
              </p>
            </div>

            <div>
              <h3 className="mb-3">Properties</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>Component ID</span>
                  <code className="bg-muted px-2 py-1 rounded text-sm">{component.id}</code>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Type</span>
                  <Badge>{config.label}</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Position</span>
                  <span className="text-muted-foreground">
                    X: {Math.round(component.x)}, Y: {Math.round(component.y)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3">Type Information</h3>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </CardContent>
        </UICard>
      </div>
    </div>
  );
}
