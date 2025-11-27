import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Clock, Pencil } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

export interface Design {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  nodesCount: number;
  connectionsCount: number;
  data: {
    cards: any[];
    connections: any[];
  };
}

interface DesignsListPageProps {
  onSelectDesign: (design: Design) => void;
  onCreateNew: () => void;
}

export function DesignsListPage({ onSelectDesign, onCreateNew }: DesignsListPageProps) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [designToRename, setDesignToRename] = useState<Design | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = () => {
    try {
      const saved = localStorage.getItem('systemDesigns');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDesigns(parsed);
      }
    } catch (error) {
      console.error('Failed to load designs:', error);
      toast.error('Failed to load designs');
    }
  };

  const handleDeleteDesign = (id: string) => {
    setDesignToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (designToDelete) {
      try {
        const updated = designs.filter(d => d.id !== designToDelete);
        localStorage.setItem('systemDesigns', JSON.stringify(updated));
        setDesigns(updated);
        toast.success('Design deleted successfully');
      } catch (error) {
        toast.error('Failed to delete design');
      }
    }
    setDeleteDialogOpen(false);
    setDesignToDelete(null);
  };

  const handleRenameDesign = (design: Design) => {
    setDesignToRename(design);
    setNewName(design.name);
    setRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (designToRename && newName.trim()) {
      try {
        const updated = designs.map(d => 
          d.id === designToRename.id 
            ? { ...d, name: newName.trim(), updatedAt: Date.now() }
            : d
        );
        localStorage.setItem('systemDesigns', JSON.stringify(updated));
        setDesigns(updated);
        toast.success('Design renamed successfully');
      } catch (error) {
        toast.error('Failed to rename design');
      }
    }
    setRenameDialogOpen(false);
    setDesignToRename(null);
    setNewName('');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="size-full bg-background p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">System Designs</h1>
            <p className="text-muted-foreground">
              Create and manage your architecture diagrams
            </p>
          </div>
          <Button onClick={onCreateNew} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            New Design
          </Button>
        </div>

        {designs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No designs yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first system design
              </p>
              <Button onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Design
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => onSelectDesign(design)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="truncate">{design.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenameDesign(design);
                        }}
                        title="Rename"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDesign(design.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(design.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Nodes:</span>
                      <span>{design.nodesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connections:</span>
                      <span>{design.connectionsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Design</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Design</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Design name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  confirmRename();
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRename}>Rename</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
