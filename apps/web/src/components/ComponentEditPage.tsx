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
import {
  Button,
  Label,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nexus/ui";

import { CardType } from "./CardSidebar";
import { toast } from "sonner";

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
    <div className="size-full bg-background overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
            <h1>Edit Component</h1>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Component
          </Button>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Component Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Component Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter component name"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Component Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as CardType)}
              >
                <SelectTrigger id="type">
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
                        <div
                          className={`${option.color} p-1 rounded text-white`}
                        >
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
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and functionality of this component..."
                rows={6}
              />
            </div>

            {/* Component Info */}
            <div className="pt-4 border-t border-border">
              <h3 className="mb-3">Component Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Component ID</p>
                  <p className="break-all">{component.id}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Position</p>
                  <p>
                    X: {Math.round(component.x)}px, Y: {Math.round(component.y)}
                    px
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Component?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{component.label}"? This action
              cannot be undone. All connections to this component will also be
              removed.
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
