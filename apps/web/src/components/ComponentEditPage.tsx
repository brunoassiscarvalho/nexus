import { useState } from "react";
import {
  Server,
  Database,
  Cloud,
  Globe,
  Layers,
  Zap,
  HardDrive,
  Network,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CardType } from "./CardSidebar";
import { toast } from "sonner@2.0.3";

interface ComponentData {
  id: string;
  type: CardType;
  label: string;
  description?: string;
  x: number;
  y: number;
}

interface ComponentEditPageProps {
  component: ComponentData;
  onBack: () => void;
  onSave: (updates: Partial<ComponentData>) => void;
  onDelete: () => void;
}

const typeOptions: Array<{
  value: CardType;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    value: "api",
    label: "API Gateway",
    icon: <Globe className="w-4 h-4" />,
    color: "bg-blue-500",
  },
  {
    value: "database",
    label: "Database",
    icon: <Database className="w-4 h-4" />,
    color: "bg-green-500",
  },
  {
    value: "service",
    label: "Service",
    icon: <Server className="w-4 h-4" />,
    color: "bg-purple-500",
  },
  {
    value: "frontend",
    label: "Frontend",
    icon: <Cloud className="w-4 h-4" />,
    color: "bg-cyan-500",
  },
  {
    value: "backend",
    label: "Backend",
    icon: <Layers className="w-4 h-4" />,
    color: "bg-indigo-500",
  },
  {
    value: "queue",
    label: "Message Queue",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-orange-500",
  },
  {
    value: "cache",
    label: "Cache",
    icon: <HardDrive className="w-4 h-4" />,
    color: "bg-red-500",
  },
  {
    value: "loadbalancer",
    label: "Load Balancer",
    icon: <Network className="w-4 h-4" />,
    color: "bg-yellow-500",
  },
];

export function ComponentEditPage({
  component,
  onBack,
  onSave,
  onDelete,
}: ComponentEditPageProps) {
  const [name, setName] = useState(component.label);
  const [description, setDescription] = useState(component.description || "");
  const [type, setType] = useState<CardType>(component.type);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Component name is required");
      return;
    }

    onSave({
      label: name,
      description,
      type,
    });

    toast.success("Component updated successfully");
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete();
    toast.success("Component deleted successfully");
  };

  const currentTypeOption = typeOptions.find((opt) => opt.value === type);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <h2 className="text-sm font-semibold">Edit Component</h2>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Component name"
              className="text-sm h-8"
            />
          </div>

          {/* Type */}
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as CardType)}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue>
                  {currentTypeOption && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`${currentTypeOption.color} p-1 rounded text-white`}
                      >
                        {currentTypeOption.icon}
                      </div>
                      <span>{currentTypeOption.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
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

          {/* Description */}
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the component..."
              rows={3}
              className="text-xs"
            />
          </div>

          {/* Info */}
          <div className="pt-2 border-t border-border space-y-2">
            <p className="text-xs font-semibold">Info</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p className="break-all">
                <span className="font-semibold">ID:</span> {component.id}
              </p>
              <p>
                <span className="font-semibold">Pos:</span> X:{" "}
                {Math.round(component.x)}px, Y: {Math.round(component.y)}px
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex gap-2 flex-shrink-0">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="flex-1 h-8 text-xs"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          size="sm"
          className="flex-1 h-8 text-xs"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} size="sm" className="flex-1 h-8 text-xs">
          Save
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Component?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{component.label}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
