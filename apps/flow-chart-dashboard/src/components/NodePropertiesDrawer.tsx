import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CardType } from './CardSidebar';
import { Circle, Square, Diamond, Hexagon, Zap } from 'lucide-react';

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
}

const cardTypeOptions: Array<{ value: CardType; label: string; icon: React.ReactNode; color: string }> = [
  { value: 'start', label: 'Start/End', icon: <Circle className="w-4 h-4" />, color: 'bg-green-500' },
  { value: 'process', label: 'Process', icon: <Square className="w-4 h-4" />, color: 'bg-blue-500' },
  { value: 'decision', label: 'Decision', icon: <Diamond className="w-4 h-4" />, color: 'bg-yellow-500' },
  { value: 'input', label: 'Input/Output', icon: <Hexagon className="w-4 h-4" />, color: 'bg-purple-500' },
  { value: 'action', label: 'Action', icon: <Zap className="w-4 h-4" />, color: 'bg-orange-500' },
];

export function NodePropertiesDrawer({ selectedCard, open, onClose, onUpdateCard }: NodePropertiesDrawerProps) {
  if (!selectedCard) return null;

  const handleLabelChange = (value: string) => {
    onUpdateCard(selectedCard.id, { label: value });
  };

  const handleTypeChange = (value: CardType) => {
    onUpdateCard(selectedCard.id, { type: value });
  };

  const currentTypeOption = cardTypeOptions.find(opt => opt.value === selectedCard.type);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[350px] sm:w-[400px]" hideOverlay>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}