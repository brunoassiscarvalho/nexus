import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CardType } from './CardSidebar';
import { Server, Database, Cloud, Globe, Layers, Zap, HardDrive, Network, Trash2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface Card {
  id: string;
  type: CardType;
  x: number;
  y: number;
  label: string;
}

interface NodePropertiesDrawerProps {
  selectedCard: Card | null;
  open: boolean;
  onClose: () => void;
  onUpdateCard: (id: string, updates: Partial<Card>) => void;
  onDeleteCard?: (id: string) => void;
  onNavigateToDetail?: (id: string) => void;
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

export function NodePropertiesDrawer({ selectedCard, open, onClose, onUpdateCard, onDeleteCard, onNavigateToDetail }: NodePropertiesDrawerProps) {
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  if (!selectedCard) return null;

  const handleLabelChange = (value: string) => {
    onUpdateCard(selectedCard.id, { label: value });
  };

  const handleTypeChange = (value: CardType) => {
    onUpdateCard(selectedCard.id, { type: value });
  };

  const handleDelete = () => {
    if (onDeleteCard) {
      onDeleteCard(selectedCard.id);
      onClose();
    }
  };

  const handleNavigateToDetail = () => {
    if (onNavigateToDetail) {
      onNavigateToDetail(selectedCard.id);
    }
  };

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

  const currentTypeOption = cardTypeOptions.find(opt => opt.value === selectedCard.type);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()} modal={false}>
      <SheetContent 
        side="right" 
        className="p-0 border-l"
        style={{ width: `${sidebarWidth}px` }}
        hideOverlay
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Resize handle */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 hover:w-2 bg-border hover:bg-primary transition-all cursor-col-resize ${
            isResizing ? 'w-2 bg-primary' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

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
                value={selectedCard.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Enter node name"
              />
            </div>

            {/* Node Type */}
            <div className="space-y-2">
              <Label htmlFor="node-type">Node Type</Label>
              <Select value={selectedCard.type} onValueChange={handleTypeChange}>
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
                <span>{Math.round(selectedCard.x)}px</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Position Y:</span>
                <span>{Math.round(selectedCard.y)}px</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Node ID:</span>
                <span className="truncate ml-2 max-w-[200px]" title={selectedCard.id}>
                  {selectedCard.id}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border space-y-3">
              {onNavigateToDetail && (
                <Button 
                  onClick={handleNavigateToDetail}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              )}

              {onDeleteCard && (
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
                        Are you sure you want to delete "{selectedCard.label}"? This will also remove all connections to this node.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}