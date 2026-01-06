import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CardType } from './CardSidebar';
import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network, Trash2, ExternalLink, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface Card {
  id: string;
  type: CardType;
  x: number;
  y: number;
  label: string;
  description?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  description?: string;
  protocol?: string;
}

interface DashboardStats {
  totalNodes: number;
  totalConnections: number;
  designName?: string;
}

interface PropertiesPanelProps {
  selectedNode: Card | null;
  selectedConnection: Connection | null;
  dashboardStats: DashboardStats;
  onUpdateNode: (id: string, updates: Partial<Card>) => void;
  onUpdateConnection: (id: string, updates: Partial<Connection>) => void;
  onDeleteNode?: (id: string) => void;
  onDeleteConnection?: (id: string) => void;
  onNavigateToDetail?: (id: string) => void;
  onDeselectNode?: () => void;
  onDeselectConnection?: () => void;
}

const cardTypeOptions: Array<{ value: CardType; label: string; icon: React.ReactNode; color: string }> = [
  { value: 'api', label: 'API Gateway', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'database', label: 'Database', icon: <Database className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'service', label: 'Service', icon: <Server className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: 'frontend', label: 'Frontend', icon: <Cloud className="w-4 h-4" />, color: 'bg-cyan-500' },
  { value: 'backend', label: 'Backend', icon: <Layers className="w-4 h-4" />, color: 'bg-indigo-500' },
  { value: 'queue', label: 'Message Queue', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-500' },
  { value: 'cache', label: 'Cache', icon: <HardDrive className="w-4 h-4" />, color: 'bg-red-500' },
  { value: 'loadbalancer', label: 'Load Balancer', icon: <Network className="w-4 h-4" />, color: 'bg-yellow-500' },
];

const protocolOptions = [
  'HTTP',
  'HTTPS',
  'TCP',
  'UDP',
  'WebSocket',
  'gRPC',
  'REST',
  'GraphQL',
  'MQTT',
  'AMQP',
  'Custom'
];

export function PropertiesPanel({ 
  selectedNode, 
  selectedConnection, 
  dashboardStats,
  onUpdateNode, 
  onUpdateConnection,
  onDeleteNode, 
  onDeleteConnection,
  onNavigateToDetail,
  onDeselectNode,
  onDeselectConnection
}: PropertiesPanelProps) {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = startX - moveEvent.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + diff));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Dashboard View
  const renderDashboardView = () => (
    <div className="p-6">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </SheetTitle>
      </SheetHeader>
      
      <div className="mt-6 space-y-6">
        {dashboardStats.designName && (
          <div className="space-y-2">
            <Label>Design Name</Label>
            <div className="p-3 bg-muted rounded-lg">
              {dashboardStats.designName}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-muted-foreground mb-1">Total Nodes</div>
            <div className="text-2xl">{dashboardStats.totalNodes}</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-muted-foreground mb-1">Connections</div>
            <div className="text-2xl">{dashboardStats.totalConnections}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>Click on a node to edit properties</li>
            <li>Click on a connection to edit its parameters</li>
            <li>Right-click for context menu</li>
            <li>Double-click node for details</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Node Properties View
  const renderNodeView = () => {
    if (!selectedNode) return null;

    const currentTypeOption = cardTypeOptions.find(opt => opt.value === selectedNode.type);

    return (
      <div className="p-6">
        <SheetHeader>
          <SheetTitle>Node Properties</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Node Name */}
          <div className="space-y-2">
            <Label htmlFor="node-name">Node Name</Label>
            <Input
              id="node-name"
              value={selectedNode.label}
              onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
              placeholder="Enter node name"
            />
          </div>

          {/* Node Description */}
          <div className="space-y-2">
            <Label htmlFor="node-description">Description</Label>
            <Textarea
              id="node-description"
              value={selectedNode.description || ''}
              onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          {/* Node Type */}
          <div className="space-y-2">
            <Label htmlFor="node-type">Node Type</Label>
            <Select value={selectedNode.type} onValueChange={(value) => onUpdateNode(selectedNode.id, { type: value as CardType })}>
              <SelectTrigger id="node-type">
                <SelectValue>
                  {currentTypeOption && (
                    <div className="flex items-center gap-2">
                      <div className={`${currentTypeOption.color} p-1 rounded text-white`}>
                        {currentTypeOption.icon}
                      </div>
                      <span>{currentTypeOption.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {cardTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`${option.color} p-1 rounded text-white`}>
                        {option.icon}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Position X:</span>
              <span>{Math.round(selectedNode.x)}px</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Position Y:</span>
              <span>{Math.round(selectedNode.y)}px</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Node ID:</span>
              <span className="truncate ml-2 max-w-[200px]" title={selectedNode.id}>
                {selectedNode.id}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border space-y-3">
            {onNavigateToDetail && (
              <Button 
                onClick={() => onNavigateToDetail(selectedNode.id)}
                className="w-full"
                variant="outline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}

            {onDeleteNode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Node
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Node</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{selectedNode.label}"? This will also remove all connections to this node.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      onDeleteNode(selectedNode.id);
                      if (onDeselectNode) onDeselectNode();
                    }}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Connection Properties View
  const renderConnectionView = () => {
    if (!selectedConnection) return null;

    return (
      <div className="p-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Connection Properties
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Connection Label */}
          <div className="space-y-2">
            <Label htmlFor="connection-label">Connection Label</Label>
            <Input
              id="connection-label"
              value={selectedConnection.label || ''}
              onChange={(e) => onUpdateConnection(selectedConnection.id, { label: e.target.value })}
              placeholder="e.g., API Call, Data Flow"
            />
          </div>

          {/* Connection Description */}
          <div className="space-y-2">
            <Label htmlFor="connection-description">Description</Label>
            <Textarea
              id="connection-description"
              value={selectedConnection.description || ''}
              onChange={(e) => onUpdateConnection(selectedConnection.id, { description: e.target.value })}
              placeholder="Describe the connection purpose"
              rows={3}
            />
          </div>

          {/* Protocol */}
          <div className="space-y-2">
            <Label htmlFor="connection-protocol">Protocol</Label>
            <Select 
              value={selectedConnection.protocol || 'HTTP'} 
              onValueChange={(value) => onUpdateConnection(selectedConnection.id, { protocol: value })}
            >
              <SelectTrigger id="connection-protocol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {protocolOptions.map((protocol) => (
                  <SelectItem key={protocol} value={protocol}>
                    {protocol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>From Node:</span>
              <span className="truncate ml-2 max-w-[200px]" title={selectedConnection.from}>
                {selectedConnection.from}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>To Node:</span>
              <span className="truncate ml-2 max-w-[200px]" title={selectedConnection.to}>
                {selectedConnection.to}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Connection ID:</span>
              <span className="truncate ml-2 max-w-[200px]" title={selectedConnection.id}>
                {selectedConnection.id}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {onDeleteConnection && (
            <div className="pt-4 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Connection
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Connection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this connection?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      onDeleteConnection(selectedConnection.id);
                      if (onDeselectConnection) onDeselectConnection();
                    }}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={true} modal={false}>
      <SheetContent 
        side="right" 
        className="p-0 border-l overflow-y-auto"
        style={{ width: `${sidebarWidth}px` }}
        hideOverlay
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Resize handle */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 hover:w-2 bg-border hover:bg-primary transition-all cursor-col-resize ${
            isResizing ? 'w-2 bg-primary' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

        {/* Render appropriate view based on selection */}
        {selectedConnection ? renderConnectionView() : selectedNode ? renderNodeView() : renderDashboardView()}
      </SheetContent>
    </Sheet>
  );
}
