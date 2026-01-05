import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlow, Card } from '../contexts/FlowContext';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

export function ComponentEditPage() {
  const { designId, componentId } = useParams<{ designId: string; componentId: string }>();
  const navigate = useNavigate();
  const { currentDesign, updateCanvasData } = useFlow();

  const component = currentDesign?.data.cards.find((c: Card) => c.id === componentId);

  const [label, setLabel] = useState(component?.label || '');
  const [description, setDescription] = useState(component?.description || '');

  const handleBack = () => {
    navigate(`/designs/${designId}/component/${componentId}`);
  };

  const handleSave = () => {
    if (!currentDesign || !component) return;

    const updatedCards = currentDesign.data.cards.map((c: Card) =>
      c.id === componentId
        ? { ...c, label, description }
        : c
    );

    updateCanvasData(updatedCards, currentDesign.data.connections);
    toast.success('Component updated successfully');
    navigate(`/designs/${designId}/component/${componentId}`);
  };

  const handleDelete = () => {
    if (!currentDesign || !component) return;

    const updatedCards = currentDesign.data.cards.filter((c: Card) => c.id !== componentId);
    const updatedConnections = currentDesign.data.connections.filter(
      (conn) => conn.from !== componentId && conn.to !== componentId
    );

    updateCanvasData(updatedCards, updatedConnections);
    toast.success('Component deleted successfully');
    navigate(`/designs/${designId}`);
  };

  if (!component) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Component not found</p>
          <Button onClick={() => navigate(`/designs/${designId}`)} className="mt-4">
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
            Back to Details
          </Button>
        </div>

        <UICard>
          <CardHeader>
            <CardTitle>Edit Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="label">Component Name</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter component name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter component description"
                rows={5}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Component</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{component.label}"? This will also remove all connections to this component.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </UICard>
      </div>
    </div>
  );
}
